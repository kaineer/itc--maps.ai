const fs = require('fs').promises;
const path = require('path');

async function testBuildingResponse() {
    try {
        // Load buildings data
        const buildingsPath = path.join(__dirname, '../import/buildings.json');
        const buildingsContent = await fs.readFile(buildingsPath, 'utf8');
        const parsedBuildings = JSON.parse(buildingsContent);
        const buildingsData = parsedBuildings.buildings || [];

        console.log('=== TESTING BUILDING DATA STRUCTURE ===');
        console.log(`Total buildings: ${buildingsData.length}`);

        // Check first building structure
        if (buildingsData.length > 0) {
            const firstBuilding = buildingsData[0];
            console.log('\nFirst building structure:');
            console.log(`  id: ${firstBuilding.id}`);
            console.log(`  address: ${firstBuilding.address}`);
            console.log(`  height: ${firstBuilding.height}`);
            console.log(`  nodes: ${firstBuilding.nodes.length} nodes`);

            // Check if height field exists and is correct type
            console.log(`\nHeight field check:`);
            console.log(`  Field exists: ${'height' in firstBuilding}`);
            console.log(`  Type: ${typeof firstBuilding.height}`);
            console.log(`  Value: ${firstBuilding.height}`);
        }

        // Simulate filtering like the backend
        console.log('\n=== TESTING FILTERING LOGIC ===');
        const position = { x: -326.31, z: 668.04 };
        const distance = 100;

        function calculateDistance(point1, point2) {
            const dx = point1[0] - point2[0];
            const dz = point1[1] - point2[1];
            return Math.sqrt(dx * dx + dz * dz);
        }

        function isBuildingWithinDistance(building, center, maxDistance) {
            for (const node of building.nodes) {
                const dist = calculateDistance(node, center);
                if (dist <= maxDistance) {
                    return true;
                }
            }
            return false;
        }

        const filteredBuildings = buildingsData.filter(building =>
            isBuildingWithinDistance(building, [position.x, position.z], distance)
        );

        console.log(`Filtered ${filteredBuildings.length} buildings within distance ${distance}`);

        // Test response format
        console.log('\n=== TESTING RESPONSE FORMAT ===');
        const responseBuildings = filteredBuildings.map(building => ({
            address: building.address,
            height: building.height,
            nodes: building.nodes,
        }));

        if (responseBuildings.length > 0) {
            const firstResponse = responseBuildings[0];
            console.log('First building in response:');
            console.log(`  address: ${firstResponse.address}`);
            console.log(`  height: ${firstResponse.height}`);
            console.log(`  nodes: ${firstResponse.nodes.length} nodes`);

            // Check if height is included in response
            console.log('\nResponse field check:');
            console.log(`  address field exists: ${'address' in firstResponse}`);
            console.log(`  height field exists: ${'height' in firstResponse}`);
            console.log(`  nodes field exists: ${'nodes' in firstResponse}`);
        }

        // Test JSON serialization
        console.log('\n=== TESTING JSON SERIALIZATION ===');
        const testResponse = {
            buildings: responseBuildings
        };

        const jsonString = JSON.stringify(testResponse);
        const parsedBack = JSON.parse(jsonString);

        if (parsedBack.buildings && parsedBack.buildings.length > 0) {
            const firstParsed = parsedBack.buildings[0];
            console.log('After JSON serialization/parsing:');
            console.log(`  address: ${firstParsed.address}`);
            console.log(`  height: ${firstParsed.height}`);
            console.log(`  nodes: ${firstParsed.nodes.length} nodes`);
        }

    } catch (error) {
        console.error('Error during test:', error);
    }
}

// Run the test
testBuildingResponse();
