import dotenv from 'dotenv';
/* eslint-disable @typescript-eslint/ban-ts-comment */
import FastifyStatic from "@fastify/static";
import Fastify from "fastify";
import fs from "fs/promises";
import path from "path";

dotenv.config()
const HOST = "0.0.0.0";
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9999;

dotenv.config();

const fastify = Fastify({
  ignoreTrailingSlash: true,
});

// @ts-ignore
// eslint-disable-next-line
const ssrModule = await import("../dist/entry-server.js");

const template = await fs.readFile(path.resolve("./dist/index.html"), "utf-8");

fastify.register(FastifyStatic, {
  prefix: "/assets/",
  root: path.resolve("./dist/assets"),
});

fastify.register(FastifyStatic, {
  prefix: "/images/",
  root: path.resolve("./dist/assets/public/images"),
  decorateReply: false,
});

fastify.get("*", async (req, reply) => {
  const response = await ssrModule.render({
    template,
    req,
    reply,
  });

  reply.status(200);
  reply.header("Content-Type", "text/html");
  return await reply.send(response);
});

fastify.listen(
  {
    host: HOST,
    port: PORT,
  },
  (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log(`⚡️ SSR Server is running on http://localhost:${PORT}`);
    }
  },
);
