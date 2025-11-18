const http = require("http");
const fs = require("fs").promises;
const path = require("path");

// Load building data
let buildingsData = [];
let itcData = {};

async function loadData() {
  try {
    const buildingsPath = path.join(__dirname, "../import/buildings.json");
    const buildingsContent = await fs.readFile(buildingsPath, "utf8");
    const parsedBuildings = JSON.parse(buildingsContent);
    buildingsData = parsedBuildings.buildings || [];

    const itcPath = path.join(__dirname, "../import/itc.json");
    const itcContent = await fs.readFile(itcPath, "utf8");
    itcData = JSON.parse(itcContent);

    console.log(`✅ Loaded ${buildingsData.length} buildings`);
  } catch (error) {
    console.error("❌ Error loading data:", error);
    throw error;
  }
}

function calculateDistance(point1, point2) {
  const dx = point1[0] - point2[0];
  const dz = point1[1] - point2[1];
  return Math.sqrt(dx * dx + dz * dz);
}

function isBuildingWithinDistance(building, center, maxDistance) {
  for (const node of building.nodes) {
    const distance = calculateDistance(node, center);
    if (distance <= maxDistance) {
      return true;
    }
  }
  return false;
}

const server = http.createServer(async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "PUT" && req.url === "/buildings") {
    let body = "";
    req.on("data", (chunk) => (body += chunk.toString()));

    req.on("end", async () => {
      try {
        const { position, distance } = JSON.parse(body);

        const filteredBuildings = buildingsData.filter((building) =>
          isBuildingWithinDistance(
            building,
            [position.x, position.z],
            distance,
          ),
        );

        const responseBuildings = filteredBuildings.map((building) => ({
          address: building.address,
          height: building.height,
          nodes: building.nodes,
        }));

        console.log(
          "📤 Sending response with buildings:",
          responseBuildings.length,
        );
        if (responseBuildings.length > 0) {
          console.log("📋 First building in response:");
          console.log("   Address:", responseBuildings[0].address);
          console.log("   Height:", responseBuildings[0].height);
          console.log("   Nodes:", responseBuildings[0].nodes.length);

          // Check if height field exists
          console.log("   Has height field:", "height" in responseBuildings[0]);
          console.log("   Height value:", responseBuildings[0].height);
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            buildings: responseBuildings,
          }),
        );
      } catch (error) {
        console.error("❌ Error:", error);
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Invalid request" }));
      }
    });
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

async function startTest() {
  try {
    await loadData();

    const PORT = 5001;
    server.listen(PORT, "127.0.0.1", () => {
      console.log(`🚀 Test server running on http://127.0.0.1:${PORT}`);

      // Make test request after server starts
      setTimeout(() => {
        console.log("\n🔍 Making test request...");
        const requestData = JSON.stringify({
          position: { x: -326.31, z: 668.04 },
          distance: 50,
        });

        const req = http.request(
          {
            hostname: "127.0.0.1",
            port: PORT,
            path: "/buildings",
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(requestData),
            },
          },
          (res) => {
            let responseData = "";
            res.on("data", (chunk) => (responseData += chunk));
            res.on("end", () => {
              console.log("\n📥 Response received:");
              try {
                const parsed = JSON.parse(responseData);
                if (parsed.buildings && parsed.buildings.length > 0) {
                  const firstBuilding = parsed.buildings[0];
                  console.log("✅ First building fields:");
                  Object.keys(firstBuilding).forEach((key) => {
                    console.log(`   ${key}: ${firstBuilding[key]}`);
                  });

                  console.log("\n🔍 Height field analysis:");
                  console.log(
                    `   Has height field: ${"height" in firstBuilding}`,
                  );
                  console.log(`   Height value: ${firstBuilding.height}`);
                  console.log(`   Height type: ${typeof firstBuilding.height}`);

                  console.log("\n📊 Full first building:");
                  console.log(JSON.stringify(firstBuilding, null, 2));

                  if ("height" in firstBuilding) {
                    console.log(
                      "\n🎉 SUCCESS: Height field is now included in the response!",
                    );
                  } else {
                    console.log(
                      "\n❌ FAILED: Height field is still missing from response",
                    );
                  }
                } else {
                  console.log("❌ No buildings in response");
                }
              } catch (e) {
                console.log("❌ Error parsing response:", e);
              }

              console.log("\n🛑 Stopping server...");
              server.close();
              process.exit(0);
            });
          },
        );

        req.on("error", (err) => {
          console.log("❌ Request error:", err);
          server.close();
          process.exit(1);
        });

        req.write(requestData);
        req.end();
      }, 100);
    });
  } catch (error) {
    console.error("❌ Failed to start test:", error);
    process.exit(1);
  }
}

// Start the test
startTest();
