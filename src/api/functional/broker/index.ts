/**
 * @packageDocumentation
 * @module api.functional.broker
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
//================================================================
import type { IConnection } from "@nestia/fetcher";
import { PlainFetcher } from "@nestia/fetcher/lib/PlainFetcher";
import type { Resolved, Primitive } from "typia";

import type { TryCatch, FailedResponse } from "../../../common/exception/index";
import type { Body } from "../../../controller/broker.controller";

export * as touser from "./touser";

/**
 * @controller BrokerController.broadcast
 * @path POST /broker/broadcast
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function broadcast(
  connection: IConnection,
  body: broadcast.Input,
): Promise<broadcast.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...connection.headers,
        "Content-Type": "application/json",
      },
    },
    {
      ...broadcast.METADATA,
      template: broadcast.METADATA.path,
      path: broadcast.path(),
    },
    body,
  );
}
export namespace broadcast {
  export type Input = Resolved<Body.IBroadcast>;
  export type Output = Primitive<TryCatch<false | true, FailedResponse>>;

  export const METADATA = {
    method: "POST",
    path: "/broker/broadcast",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 201,
  } as const;

  export const path = () => "/broker/broadcast";
}

/**
 * @controller BrokerController.novel
 * @path POST /broker/novel
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 */
export async function novel(
  connection: IConnection,
  body: novel.Input,
): Promise<novel.Output> {
  return PlainFetcher.fetch(
    {
      ...connection,
      headers: {
        ...connection.headers,
        "Content-Type": "application/json",
      },
    },
    {
      ...novel.METADATA,
      template: novel.METADATA.path,
      path: novel.path(),
    },
    body,
  );
}
export namespace novel {
  export type Input = Resolved<Body.INovel>;
  export type Output = Primitive<TryCatch<false | true, FailedResponse>>;

  export const METADATA = {
    method: "POST",
    path: "/broker/novel",
    request: {
      type: "application/json",
      encrypted: false,
    },
    response: {
      type: "application/json",
      encrypted: false,
    },
    status: 201,
  } as const;

  export const path = () => "/broker/novel";
}
