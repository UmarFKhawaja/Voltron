import { AnyObject, Document, Schema } from 'mongoose';

type JSONOutput = {
  [key: string]: string;
};

function toJSON(document: Document, output: JSONOutput): JSONOutput {
  // NOTE : remove the `_id` field from the JSON output
  delete output['_id'];

  // NOTE : remove any fields with `hide` specified in the schema from the JSON output
  document.schema.eachPath((path: string, { options }: { options: AnyObject }) => {
    if (options?.['hide']) {
      delete output[path];
    }
  });

  return output;
}

export function setSchemaDefaults(schema: Schema) {
  // NOTE : ensure timestamps are enabled by default
  schema.set('timestamps', true);

  // NOTE : configure output fields for toJSON and transformation
  schema.set('toJSON', {
    getters: true,
    virtuals: true,
    aliases: true,
    minimize: false,
    versionKey: false,
    transform: toJSON
  });
}
