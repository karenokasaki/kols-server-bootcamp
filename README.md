# KOLS SERVER #1

Back-end project for inventory control app (**mobile** and **web**)!

# About the project

This project has been created in the third module at Ironhack São Paulo - Web Development Bootcamp.

Simple REST API to allow for complete CRUD  at the endpoint:
https://kols-server.herokuapp.com

**Caution: Exclusive use for Kols-Client**

# Usage

Complete CRUD functionality

## User Routes

**Create**

    POST /users/create-user

**Login**

    POST /users/login

**Get Current User**

    GET /users/profile
    
**Update Account**

    PATCH /users/profile/update
    
**Delete Account**

    DELETE /users/profile/disable-account
    
**Active Account**

    PATCH /users/profile/active-account

## Business Routes

**Create**

    POST /business/create-business

**Get Current Business by Id**

    GET /business/profile/:id

**Update Business**

    PATCH /business/update/:id

**Delete Business**

    DELETE /business/:idBusiness/disable-business

**Active Business**

    PATCH /business/:idBusiness/active-business
    
## Log Route

**Get Log Current Business by Id**

    GET /business/:idBusiness/log

## Products Routes

**Create Product for Current Business**

    POST /products/:idBusiness/create-product

**Get All Products from Current Business**

    GET /products/idBusiness

**Get Specific Product by Id**

    GET /products/product/:id

**Update Product**

    PATCH /products/product/update/:id

**Delete Product**

    DELETE /products/delete/:id

**Input Product**

    PATCH /products/input-product

**Output Product**

    PATCH /products/output-product

## Password Routes

**Forgot Password**

    POST /resetPassword/forgot-password

**New Password**

    PUT /resetPassword/new-password/:token

## Upload Route

**Send Image**

    POST /upload/image
    
# Developers GitHub

- [João Vítor Ferraz](https://github.com/jotavkf)
- [Karen Okasaki](https://github.com/karenokasaki)
- [Leonardo Santini](https://github.com/LeoSantini)

# KOLS CLIENT

Front-end for inventory control app (**mobile** and **web**)!

[Click here](https://github.com/jotavkf/kols-client)

## Install
To run the application on your localhost, clone the repo and then execute the commands below:

**Note: Don't forget to create .env and update like exemple.env**

- <code>$ git clone https://github.com/karenokasaki/kols-server</code>
- <code>$ cd kols-server npm install</code>
- <code>$ npm run start</code>
