# Fake Store App

A responsive and dynamic E-Commerce web application built with React that fetches and displays products from the FakeStore API. Users can search for products, filter by category, and view detailed product information in a modal.

## Features
- Real-time product search 
- Category-based filtering
- Product detail modal with image, price, description, rating, and stock info
- Skeleton loading state 


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


## What I Learned
- Creating responsive UI with modal popups using shadcn libraries
- Managing compound filters (search + category) with minimal re-renders

## Challenges Faced
- Preventing API calls on every keystroke (only search on **Enter**)
- Managing multiple filters simultaneously (search term and category)
- Designing a consistent modal experience 
