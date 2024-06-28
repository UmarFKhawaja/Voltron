import { VariableValue } from '../../models/variable-value/variable-value.class';

export interface VariableView {
  name: string;
  value: VariableValue;
  change: () => void;
  delete: () => void;
}
