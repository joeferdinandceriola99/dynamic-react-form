import React, { FC } from "react";
import { Select, TextField, MenuItem } from "@mui/material";

interface DynamicInputProps {
  type: string;
  name: string;
  label: string;
  value: any;
  options?: Array<string>;
  onChange: any;
  disabled: boolean;
}

const DynamicInput: FC<DynamicInputProps> = ({
  type,
  name,
  label,
  value,
  options,
  onChange,
  disabled,
}) => {
  switch (type) {
    case "select":
      return (
        <Select
          value={value}
          disabled={disabled}
          name={name}
          label={label}
          onChange={onChange}
          defaultValue={value}
        >
          {options?.map((item, index) => (
            <MenuItem key={index} value={item}>
              {item}
            </MenuItem>
          ))}
        </Select>
      );
    case "multiline":
      return (
        <TextField
          defaultValue={value}
          disabled={disabled}
          name={name}
          label={label}
          onChange={onChange}
          multiline
          rows={4}
        />
      );

    default:
      return (
        <TextField
          defaultValue={value}
          type={type}
          disabled={disabled}
          name={name}
          label={label}
          onChange={onChange}
        />
      );
  }
};

export default DynamicInput;
