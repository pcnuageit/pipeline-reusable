import {
  Box,
  Checkbox,
  FormControlLabel,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { memo } from "react";

export default function SelectPermission({
  permissions = {},
  state = {},
  setState = () => null,
}) {
  const parsedResponseObj = {};
  function parseResponseToObj(item, depth = 0, parentObj = parsedResponseObj) {
    const collectedIds = [];

    for (const key in item) {
      if (Array.isArray(item[key])) {
        parentObj[key] = {
          root: {
            name: key,
            idArr: [],
            depth,
          },
        };

        const childIds = parseResponseToObj(
          item[key],
          depth + 1,
          parentObj[key]
        );
        parentObj[key].root.idArr.push(...childIds);
        collectedIds.push(...childIds);
      }

      if (!item[key]?.id && !Array.isArray(item[key])) {
        parentObj[key] = {
          root: {
            name: key,
            idArr: [],
            depth,
          },
        };

        const childIds = parseResponseToObj(
          item[key],
          depth + 1,
          parentObj[key]
        );
        parentObj[key].root.idArr.push(...childIds);
        collectedIds.push(...childIds);
      }

      if (item[key]?.id) {
        const id = item[key]?.id;

        parentObj.root.idArr.push(id);
        collectedIds.push(id);
        parentObj[key] = {
          name: item[key]?.nome,
          id,
          depth,
        };
      }
    }

    return collectedIds;
  }
  parseResponseToObj(permissions);

  const parsedResponseArr = [];
  function parseResponseToFlatArr(item) {
    for (const key in item) {
      if (item[key]?.root) {
        parsedResponseArr.push(item[key].root);
        parseResponseToFlatArr(item[key]);
      }

      if (item[key]?.id) {
        parsedResponseArr.push(item[key]);
      }
    }
  }
  parseResponseToFlatArr(parsedResponseObj);

  function GeneratedList() {
    return parsedResponseArr?.map((obj) => {
      if (obj?.idArr) {
        return (
          <SelectPermissionTitle
            key={obj?.name}
            obj={obj}
            state={state}
            setState={setState}
          />
        );
      } else {
        return (
          <SelectPermissionItem
            key={obj?.id}
            obj={obj}
            checked={!!state?.permissoes?.includes(obj?.id)}
            setState={setState}
          />
        );
      }
    });
  }

  return <>{GeneratedList()}</>;
}

const SelectPermissionTitle = ({ obj, state = {}, setState = () => null }) => {
  const classes = useStyles();

  const ids = obj?.idArr;
  const checked =
    state?.permissoes.length > 0 &&
    ids?.every((id) => state?.permissoes?.includes(id));
  const intermediate = ids?.some((id) => state?.permissoes?.includes(id));

  const handleCheck = () => {
    if (checked || intermediate) {
      setState((prev) => ({
        ...prev,
        permissoes: prev?.permissoes?.filter((item) => !ids.includes(item)),
      }));
    } else {
      setState((prev) => ({
        ...prev,
        permissoes: [...prev?.permissoes, ...obj?.idArr],
      }));
    }
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: obj?.depth * 16,
      }}
    >
      <FormControlLabel
        label={<Typography className={classes.title}>{obj?.name}</Typography>}
        control={
          <Checkbox
            checked={checked}
            indeterminate={!checked && intermediate}
            onChange={handleCheck}
            style={{
              alignItems: "flex-start",
            }}
          />
        }
      />
    </Box>
  );
};

const SelectPermissionItem = memo(
  ({ obj, checked = false, setState = () => null }) => {
    const id = obj?.id;
    const handleCheck = () => {
      if (checked) {
        setState((prev) => ({
          ...prev,
          permissoes: prev?.permissoes?.filter((item) => item !== id),
        }));
      } else {
        setState((prev) => ({
          ...prev,
          permissoes: [...prev?.permissoes, id],
        }));
      }
    };

    return (
      <Box
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          paddingLeft: obj?.depth * 16,
        }}
      >
        <FormControlLabel
          label={obj?.name}
          control={
            <Checkbox
              checked={checked}
              onChange={handleCheck}
              style={{
                alignItems: "flex-start",
              }}
            />
          }
        />
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.checked === nextProps.checked;
  }
);

const useStyles = makeStyles((theme) => ({
  title: {
    color: theme.palette.primary.main,
  },
}));
