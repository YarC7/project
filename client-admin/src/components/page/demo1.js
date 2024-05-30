import React, { useState } from 'react';
import { Select, MenuItem, TextField, FormControl, InputLabel, Chip, Box } from '@mui/material';

const ProductSelector = () => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({});

  const handleProductChange = (event) => {
    setSelectedProducts(event.target.value);
  };

  const handleQuantityChange = (product, event) => {
    setQuantities({
      ...quantities,
      [product]: event.target.value,
    });
  };

  const products = ['Product 1', 'Product 2', 'Product 3'];

  return (
    <FormControl fullWidth>
      <InputLabel id="product-select-label">Products</InputLabel>
      <Select
        labelId="product-select-label"
        multiple
        value={selectedProducts}
        onChange={handleProductChange}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
      >
        {products.map((product) => (
          <MenuItem key={product} value={product}>
            {product}
          </MenuItem>
        ))}
      </Select>

      {selectedProducts.map((product) => (
        <TextField
          key={product}
          label={`Quantity for ${product}`}
          type="number"
          value={quantities[product] || ''}
          onChange={(event) => handleQuantityChange(product, event)}
          margin="normal"
          fullWidth
        />
      ))}
    </FormControl>
  );
};

export default ProductSelector;
