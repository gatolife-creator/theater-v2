import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
};

export const Main = (props: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto"
    >
      {props.children}
    </motion.div>
  );
};
