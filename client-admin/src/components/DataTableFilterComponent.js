import React, { useEffect, useState ,useRef} from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import {
  ArrowDropDown as ArrowDropDownIcon,
  ArrowDropUp as ArrowDropUpIcon,
} from "@mui/icons-material";

const Dropdown = ({ id, value, onChange, label, options }) => {
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
          const { label: optionLabel, value } = option;
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

const DataTableFilter = ({
  rows,
  setFilteredData,
  categoryOptions,
  nameOptions,statusOptions,
  initialFilters,
  filterKeys,
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({ ...initialFilters });

  const toggleShowFilters = () => setShowFilters((s) => !s);
  const resetFilters = () => {
    setFilters({ ...initialFilters });
  };
  const setFilteredDataRef = useRef();
  setFilteredDataRef.current = setFilteredData;

  useEffect(() => {
    const filteredRows = rows.filter((row) => {
      const matchesFilter = Object.keys(filters).every((key) => {
        if (key === "category" && filters[key].length > 0) {
          return filters[key].includes(row.category.name);
        }
        if (key === "customer" && filters[key].length > 0) {
          return filters[key].includes(row.customer.name);
        }
        if (key === "status" && filters[key].length > 0) {
          return filters[key].includes(row.status);
        }
        if (filters[key] !== initialFilters[key]) {
          const rowValues = filterKeys.map((filterKey) => row[filterKey]);
          try {
            const filterRegex = new RegExp(filters[key], "gi");
            return rowValues.some((value) => String(value).match(filterRegex));
          } catch {
            return rowValues.some(
              (value) => String(value).indexOf(filters[key]) !== -1
            );
          }
        }
        return true;
      });
      return matchesFilter;
    });
    // setFilteredData(filteredRows);
    setFilteredDataRef.current(filteredRows);
  }, [filters, rows, setFilteredData, initialFilters, filterKeys]);

  const hasCategoryData = rows.some((row) => row.category);
  const hasCusData = rows.some((row) => row.customer);
  
  return (
    <Box m={2}>
      <Button
        onClick={toggleShowFilters}
        variant="contained"
        disableElevation
        endIcon={showFilters ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
      >
        {showFilters ? "Hide filters" : "Filter"}
      </Button>
      {showFilters && (
        <Box py={1}>
          <Card variant="outlined">
            <CardHeader
              titleTypographyProps={{ variant: "h6" }}
              title="Filter options"
            />
            <CardContent>
              <Grid container spacing={4}p={2} rowSpacing={2}>
                {hasCategoryData && (
                <Grid item xs={12} sm={6} lg={3}>
                  <Dropdown
                    id="category"
                    value={filters.category}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        category: e.target.value,
                      }))
                    }
                    label="Categories"
                    options={categoryOptions}
                  />
                </Grid>
                )}
                {hasCusData && (
                <Grid item xs={12} sm={6} lg={3}>
                  <Dropdown
                    p = {2}
                    id="customer"
                    value={filters.customer}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        customer: e.target.value,
                      }))
                    }
                    label="Teachers"
                    options={nameOptions}
                  />
                  <Dropdown
                    id="status"
                    value={filters.status}
                    onChange={(e) =>
                      setFilters((prevFilters) => ({
                        ...prevFilters,
                        status: e.target.value,
                      }))
                    }
                    label="Status"
                    options={statusOptions}
                  />
                </Grid>
                )}
                {Object.entries(filters).map(([key, value]) => (
                  
                  <Grid key={key} item xs={12} sm={6} lg={3}>
                    {key === "category" ? (
                    <p></p>
                    ) : key === "customer" ? (
                    <p></p>
                    ) : key === "status" ? (
                      <p></p>
                    ) :
                    
                    (
                    <TextField
                      value={value}
                      onChange={(e) =>
                        setFilters((prevFilters) => ({
                          ...prevFilters,
                          [key]: e.target.value,
                        }))
                      }
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      variant="filled"
                      fullWidth
                    />
                    )} 
                    
                  </Grid>
                ))}
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
};

export default DataTableFilter;
