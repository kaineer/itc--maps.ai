import { FBXLoader } from "three/examples/jsm/Addons.js";
import { createAuthService } from "@services/authService";
import { FileLoader, Group, LoadingManager } from "three";

export class AuthorizedFBXLoader extends FBXLoader {
  constructor(manager?: LoadingManager) {
    super(manager);
  }

  load(
    url: string,
    onLoad?: (data: Group) => void,
    onProgress?: (e: ProgressEvent) => void,
    onError?: (err: unknown) => void,
  ) {
    // Создаем кастомный FileLoader с заголовками
    const fileLoader = new FileLoader(this.manager);
    const authService = createAuthService();
    const { Authorization } = authService.getHeaders();

    fileLoader.setResponseType("arraybuffer");
    if (Authorization) {
      fileLoader.setRequestHeader({
        Authorization,
      });
    }

    fileLoader.load(
      url,
      (buffer) => {
        try {
          const fbx = this.parse(buffer, url);
          if (onLoad) onLoad(fbx);
        } catch (e) {
          if (onError) onError(e);
          else throw e;
        }
      },
      onProgress,
      onError,
    );
  }
}
