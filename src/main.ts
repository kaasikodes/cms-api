import { ENV } from "./config/enviroment";
import { createServer } from "./server";

const server = createServer();

server.listen(ENV.PORT, () => {
  console.log(
    `server running on http://localhost:${ENV.PORT} in ${ENV.NODE_ENV} mode.\npress CTRL-C to stop`
  );
});
