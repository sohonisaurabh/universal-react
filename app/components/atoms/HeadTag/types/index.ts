export type Props = {
  content?: string;
  title?: string;
  schema?: any;
  description?: string;
};

export type MetaProps = {
  prefix?: string;
  meta: {
    id: number;
    key: string;
    content?: string;
  };
  content: string;
};

export type MetaAttrs = {
  content: string;
  property?: string;
  name?: string;
};
