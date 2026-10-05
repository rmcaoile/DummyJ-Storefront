# Dummy Store

A responsive and dynamic E-Commerce web application built with React that fetches and displays products from DummyJSON. Users can search for products, filter by category, and view detailed product information in a modal. Primarily built to practise **Redux state management**.


### Data source

Products, users, and carts come from [DummyJSON](https://dummyjson.com), a free
public mock e-commerce API. No API key or signup is required.
The app originally used fakestoreapi.com, but was converted to DummyJSON.


## Tech Stack

- React
- Vite
- JavaScript
- Redux Toolkit
- Tailwind CSS
- shadcn/ui
- Axios
- DummyJSON (data source)


## Features
- Real-time product search 
- Category-based filtering
- Product detail modal with image, price, description, rating, and stock info
- Item checkout simulation
- Skeleton loading state 
- Toast notification


## How to Run

Install the dependencies, then start the Vite dev server.

```bash
npm install
npm run dev
```


## Sample Accounts

Log in with any of these sample accounts:

| Username | Password |
| --- | --- |
| `emilys` | `emilyspass` |
| `michaelw` | `michaelwpass` |
| `sophiab` | `sophiabpass` | 



## Walkthrough
- **Initial Load**  
  On app mount, a GET request is made to the FakeStore API to fetch product data.  
  While loading, skeleton cards are shown.

- **Search Input**  
  Users can type a keyword (e.g., product name or category).  
  Pressing **Enter** filters products matching the term.

- **Category Filter**  
  Clickable buttons allow filtering products by category.  
  Selecting a category updates the filtered results in real time.

- **Product Modal**  
  Clicking on any product card opens a modal displaying:
  - Product image
  - Title, price, and category
  - Rating and available stock
  - Description

- **Error Handling**  
  If an error occurs while fetching products, a descriptive error message is shown.  
  If no matching products are found, an appropriate message appears.

