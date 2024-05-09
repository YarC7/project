import React, {useEffect, useState} from "react";
import {
  Box,
  CardActions,
  CardContent,
  TextField,
  CardHeader,
  Grid,
  Card,
  FormControl,
  Select,
  Typography,
  InputLabel,Button,
  MenuItem,MuiButton
} from "@mui/material";




import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

const Dropdown = ({id, value, onChange, label, options}) => {
  const forwardID = id ?? `${JSON.stringify(options)}-select`;
  return (
    <FormControl variant="filled" fullWidth>
      <InputLabel id={`${forwardID}-label`}>{label}</InputLabel>
      <Select
        labelId={`${forwardID}-label`}
        fullWidth
        multiple
        id={forwardID}
        value={value}
        onChange={onChange}
        label={label}
        variant="filled"
      >
        {options.map((option) => {
          const {label: optionLabel, value} = option;
          return (
            <MenuItem key={value} value={value}>
              {optionLabel}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};


const categories = {
  iceCream: {
    name: "ice cream",
    class: "blue"
  },
  doughnut: {
    name: "doughnut",
    class: "pink"
  },
  cake: {
    name: "cake",
    class: "green"
  },
  cookie: {
    name: "cookie",
    class: "purple"
  }
};

function createData(name, calories, fat, carbs, protein, category, headers) {
  return {name, calories, fat, carbs, protein, category, headers};
}

const rows = [
  createData(
    {label: "Name"},
    {label: "Calories", numeric: true},
    {label: "Fat (g)", numeric: true},
    {label: "Carbs (g)", numeric: true},
    {label: "Protein (g)", numeric: true},
    {label: "Category"},
    true
  ),
  createData("Frozen yogurt", 159, 6.0, 24, 4.0, categories.iceCream),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3, categories.iceCream),
  createData("Eclair", 262, 16.0, 24, 6.0, categories.doughnut),
  createData("Cupcake", 305, 3.7, 67, 4.3, categories.cake),
  createData("Gingerbread", 356, 16.0, 49, 3.9, categories.cookie)
];

const tupleEquals = (a, b) => a[0] === b[0] && a[1] === b[1];

const dataRows = rows.filter((r) => r.headers !== true);

const categoryOptions = Array.from(
  new Set(dataRows.map((r) => r.category.name))
).map((c) => ({label: c, value: c}));

const initialName = "";
const initialCalories = "";
const initialFat = "";
const initialCarbs = "";
const initialProtein = "";

export default function BasicTable() {
  // const classes = useStyles();
  const [data, setData] = useState(rows);

  const [showFilters, setShowFilters] = useState(false);

  const [filterName, setFilterName] = useState(initialName);
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterCalories, setFilterCalories] = useState(initialCalories);
  const [filterFat, setFilterFat] = useState(initialFat);
  const [filterCarbs, setFilterCarbs] = useState(initialCarbs);
  const [filterProtein, setFilterProtein] = useState(initialProtein);

  const [appliedFilters, setAppliedFilters] = useState([]);

  const addAppliedFilter = (filter) =>
    setAppliedFilters((current) => {
      if (current.includes(filter)) return current;
      return [...current, filter];
    });

  const removeAppliedFilter = (filter) =>
    setAppliedFilters((current) => current.filter((e) => e !== filter));

  const filtersCount = appliedFilters.length;

  const toggleShowFilters = () => setShowFilters((s) => !s);
  const resetFilters = () => {
    setAppliedFilters([]);
    setData(rows);
    setFilterName(initialName);
    setFilterCategories([]);
    setFilterCalories(initialCalories);
    setFilterFat(initialFat);
    setFilterCarbs(initialCarbs);
    setFilterProtein(initialProtein);
  };

  useEffect(() => {
    const updatedRows = rows
      .filter((r) => {
        if (r.headers) return true;
        if (initialName !== filterName) {
          addAppliedFilter("name");
          try {
            const filterNameRegEx = new RegExp(filterName, "gi");
            return r.name.match(filterNameRegEx);
          } catch {
            return r.name.indexOf(filterName) !== -1;
          }
        }
        removeAppliedFilter("name");
        return true;
      })
      .filter((r) => {
        if (r.headers) return true;
        if (filterCategories.length > 0) {
          addAppliedFilter("category");
          return filterCategories.includes(r.category.name);
        }
        removeAppliedFilter("category");
        return true;
      })
      .filter((r) => {
        if (r.headers) return true;
        if (initialCalories !== filterCalories) {
          addAppliedFilter("calories");
          try {
            const filterCaloriesRegEx = new RegExp(filterCalories, "gi");
            return r.calories.match(filterCaloriesRegEx);
          } catch {
            return r.calories.indexOf(filterCalories) !== -1;
          }
        }
        removeAppliedFilter("calories");
        return true;
      })
      .filter((r) => {
        if (r.headers) return true;
        if (initialFat !== filterFat) {
          addAppliedFilter("fat");
          try {
            const filterFatRegEx = new RegExp(filterFat, "gi");
            return r.fat.match(filterFatRegEx);
          } catch {
            return r.fat.indexOf(filterFat) !== -1;
          }
        }
        removeAppliedFilter("fat");
        return true;
      })
      .filter((r) => {
        if (r.headers) return true;
        if (initialCarbs !== filterCarbs) {
          addAppliedFilter("carbs");
          try {
            const filterCarbsRegEx = new RegExp(filterCarbs, "gi");
            return r.carbs.match(filterCarbsRegEx);
          } catch {
            return r.carbs.indexOf(filterCarbs) !== -1;
          }
        }
        removeAppliedFilter("carbs");
        return true;
      })
      .filter((r) => {
        if (r.headers) return true;
        if (initialProtein !== filterProtein) {
          addAppliedFilter("protein");
          try {
            const filterProteinRegEx = new RegExp(filterProtein, "gi");
            return r.protein.match(filterProteinRegEx);
          } catch {
            return r.protein.indexOf(filterProtein) !== -1;
          }
        }
        removeAppliedFilter("protein");
        return true;
      });
    setData(updatedRows);
  }, [
    filterCalories,
    filterCategories,
    filterCarbs,
    filterFat,
    filterName,
    filterProtein
  ]);

  return (
    <Box m={2}>
      <Button
        onClick={toggleShowFilters}
        variant="contained"
        disableElevation
        endIcon={showFilters ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {showFilters ? "Hide filters" : "Filter"}
        {filtersCount > 0 ? ` (${filtersCount})` : ""}
      </Button>
      {filtersCount > 0 && (
        <Button ml={2} onClick={resetFilters}>
          Reset filters
        </Button>
      )}
      {showFilters && (
        <Box py={1}>
          <Card variant="outlined">
            <CardHeader
              titleTypographyProps={{variant: "h6"}}
              title="Filter options"
            />
            <CardContent>
              <Grid container spacing={4}>
                <Grid item container spacing={4}>
                  <Grid item xs={12} sm={6} lg={3}>
                    <TextField
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                      label="Name"
                      variant="filled"
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} lg={3}>
                    <Dropdown
                      id="category"
                      value={filterCategories}
                      onChange={(e) => setFilterCategories(e.target.value)}
                      label="Categories"
                      options={categoryOptions}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    value={filterCalories}
                    onChange={(e) => setFilterCalories(e.target.value)}
                    label="Name"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    value={filterFat}
                    onChange={(e) => setFilterFat(e.target.value)}
                    label="Name"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    value={filterCarbs}
                    onChange={(e) => setFilterCarbs(e.target.value)}
                    label="Name"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6} lg={3}>
                  <TextField
                    value={filterProtein}
                    onChange={(e) => setFilterProtein(e.target.value)}
                    label="Name"
                    variant="filled"
                    fullWidth
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
              <Button onClick={resetFilters} size="small">
                Reset
              </Button>
            </CardActions>
          </Card>
        </Box>
      )}

    </Box>
  );
}
