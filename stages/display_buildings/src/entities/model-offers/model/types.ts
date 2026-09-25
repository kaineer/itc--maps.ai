import type { UserId } from "@entities/users";
import type { ModelId } from "@entities/buildings";

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
