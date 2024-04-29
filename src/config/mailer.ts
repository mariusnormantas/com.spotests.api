/** @format */

import nodemailer from "nodemailer";
import handlebars from "nodemailer-express-handlebars";
import path from "path";

const user = process.env.SMTP_USER?.toString() ?? "";
const pass = process.env.SMTP_PASSWORD?.toString() ?? "";
const host = process.env.SMTP_HOST?.toString() ?? "";
const port = parseInt(process.env.SMTP_PORT ?? "");

export const mailer = nodemailer.createTransport({
  auth: { user, pass },
  host,
  port,
});

mailer.use(
  "compile",
  handlebars({
    viewEngine: {
      partialsDir: path.resolve("./src/templates/mailer"),
      extname: ".handlebars",
      defaultLayout: false,
    },
    viewPath: path.resolve("./src/templates/mailer"),
    extName: ".handlebars",
  })
);
