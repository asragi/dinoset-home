import { send } from "@emailjs/browser";

const serviceId = "service_tl2s4dr";
const templeteId = "template_90fvelc";
const publicKey = "IHJjlIOiDwkmYdrTk";

type Props = {
  from_name: string,
  email: string,
  message: string,
};

export const sendMail = (templeteProps: Props) => {
  return send(
    serviceId,
    templeteId,
    templeteProps,
    publicKey
  );
};
