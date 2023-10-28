import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import postRouter from "./post";
import categoryRouter from "./category";

const v1: Router = Router();

// v1.use("/", (req, res) => {
//   return res.json({ ok: true, data: { message: "Welcome to CMS v1" } });
// });
v1.use("/auth", authRouter);
v1.use("/user", userRouter);
v1.use("/post", postRouter);
v1.use("/category", categoryRouter);

export default v1;
