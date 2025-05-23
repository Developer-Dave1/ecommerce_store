/*

ECOMMERCE APP

MAIN PURPOSE: display and track inventory of store items

APP FUCTIONALITY
- add item
- modify item (change name, change price, quanity on new shipment)
- delete item
- in stock
- out of stock
- how many in stock
- add item to cart
- check-out item (remove item from inventory)
- user login (to add items to cart and check-out, and/or save items for later)
- admin login (used to update, modify items, add items)
- display table of inventory

BASIC DESIGN PRINCIPLES
- login
- show items for sale (includes, picture, price)
- display total amount in cart
- have seperate route for cart to show items, images and prices
- checkout cart which updates inventory

BASIC STRUCTURE
- dependencies (install)
    - express
    - morgan
    - path
    - session
    - flash
    - validator
    - postgres

- application setup
    - require installed items
    - invoke express()
    - identify host "localhost"
    - identify port "3000"
    - conncect to postgres database
    - initialize view engine

- middleware setup
    - app.use morgan
    - serve static
    - flash
    - session
    - error handling

- setup routes
    - login
    - store main
    - cart
    - logout page

- tests with Jest
*/