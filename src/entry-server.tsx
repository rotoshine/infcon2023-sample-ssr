import { FastifyRequest, FastifyReply } from "fastify";
import {
  StaticHandlerContext,
  StaticRouterProvider,
  createStaticHandler,
  createStaticRouter,
} from "react-router-dom/server";
import routes from "./routes";
import ReactDOM from "react-dom/server";
import createFetchRequest from "./request";
import {
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";
import { fetchMusicians } from "./hooks/useFetchMusicians";

interface RenderingProps {
  template: string;
  req: FastifyRequest;
  reply: FastifyReply;
}

const handler = createStaticHandler(routes);

export async function render({ template, req }: RenderingProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        suspense: false,
      },
    },
  });

  const fetchRequest = createFetchRequest(req);
  const context = (await handler.query(fetchRequest)) as StaticHandlerContext;
  const router = createStaticRouter(handler.dataRoutes, context);

  console.log(req.url);
  if (req.url === "/musicians/") {
    console.log("prefetch~");
    await queryClient.prefetchQuery(["musicians"], fetchMusicians);
  }

  const dehydratedState = dehydrate(queryClient);

  const html = ReactDOM.renderToString(
    <QueryClientProvider client={queryClient}>
      <StaticRouterProvider router={router} context={context} />
    </QueryClientProvider>,
  );

  template = template
    .replace("{{SSR_CONTENT}}", html)
    .replace("{{INITIAL_STATE}}", JSON.stringify(dehydratedState));

  return template;
}
