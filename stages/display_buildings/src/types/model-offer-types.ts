import { UserId } from "./auth-types";
import { ModelId } from "./buildings-types";

export interface ModelOffer {
  id: string;
  address: string;
  description: string;
  author: UserId;
  modelId: ModelId;
  // fileId: ???
}

export type CreateModelOffer = Omit<ModelOffer, "id" | "author"> &
  Partial<Pick<ModelOffer, "author">>;
