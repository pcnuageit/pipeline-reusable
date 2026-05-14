import { FormHelperText } from "@material-ui/core";

const CustomFormHelperText = ({ errorMessage }) => {
  return (
    <>
      {errorMessage && (
        <FormHelperText
          style={{
            marginBottom: "6px",
            marginTop: "0px",
            width: "60%",
            color: "red",
          }}
        >
          {errorMessage}
        </FormHelperText>
      )}
    </>
  );
};

export default CustomFormHelperText;
