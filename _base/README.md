# Towech - FinanceApp

This repository is to serve a basic example of the complete application as well as to serve as a front for the documentation, the repositories that form the complete app can be found [here](https://github.com/towech-financeapp).

The Towech FinanceApp is a web based application that allows users to manage their personal finances by having multiple wallets, creating/editing transactions and managing transference between them.

The application uses a _microservice_ approach by containerizing parts of the code so they can be easily scaled in case it is needed. Due to the smaller scope of the application this is completely overkill, however it is meant to easily learn how these kinds of applications can be created.

## Table of Contents

1. [Architecture](#Architecture)
   1. [Data](#Arch_Data)
   2. [Application](#Arch_App)
   3. [Infrastructure](#Arch_Infraestructure)
2. [Installation](#Installation)
   1. [External requirements](#Inst_ext)
   2. [Installing example](#Inst_exa)
3. [Credits](#Credits)

## Architecture

### Data Architecture

The application mainly consists of managing the information contained within 4 datatypes:

**Categories:** Categories are simple tags that indicate types for transactions, indicate if they are either Income or Expense.

**Transactions:** Transactions are the main way the finances are managed, they contain a category, concept and most importantly, an amount. All transactions require to have a wallet they belong to.

**Wallets:** Wallets are collections of transactions, by grouping the transactions together, different "accounts" or "budgets" can be managed. By using wallets, transactions can be linked together to represent transferences between them. Wallets can also contain SubWallets which allow to further subdivide the transactions, only two layers of Wallets are allowed.

**Users:** Users are the topmost data type, each user is able to create wallets that allow them to manage their finances. This datatype contains all the necessary information to authenticate.

![Data Diagram](media/data.png)

### Application

The application is divided in parts that communicate together, due to the microservice oriented nature of the project, each part of the application can be separated.

[**WebClient:**](https://github.com/towech-financeApp/WebClient) A ReactJS based web frontend application that serves as the UI of the project. It allows the users to do all the functions the application has. It communicates with the API.

[**API:**](https://github.com/towech-financeApp/WebApi) An Express.jS API that handles the authentication parameters, as well as passing any http request to the services to be processed.

[**UserService:**](https://github.com/towech-financeApp/UserService) Worker that contains all the logic and rules the data regarding the users should follow, such as password changes, adding users, registering the amount of active sessions etc. Also is in charge of the mailing system for the application.

[**TransactionService:**](https://github.com/towech-financeApp/TransactionService) Worker that manages both the wallets and the transactions, is in charge of adding/editing/deleting, both wallets and transactions. Manages the transferences between wallets and ensures the totals add up.

[**CategoryService**](https://github.com/towech-financeApp/CategoryReportService) Worker in charge of the categories, currently is the most unused service, however future upgrades will allow it to generate reports of a determined time.

**Database:** The application uses a MongoDB database to keep all the information.

![App Diagram](media/app.png)

### Infrastructure

Since the application is designed with a microservice approach, the all the components of the application communicate diversely. the API communicates with the outside using HTTP, while communicates with the services using the AMQP protocol.

A deployment of the complete application would look like this:
![Infrastructure Diagram](media/infra.png)

The example provided in this documentation deploys a very simple example with only one container per component.

## Installation

Installation of the system requires at least one instance of every component, as well as a MongoDB database and a AMQP broker. There are also a couple of required connection strings necessary to run all elements of the application.

### External requirements

The first step is to acquire an email account that the system will use. The application is designed to utilize google with oauth2. A guide to obtaining the token can be found [here](https://developers.google.com/identity/protocols/oauth2). The strings that will be needed are the following:

```
EMAIL=<user>@gmail.com
EMAIL_CLIENT_ID=<id>.apps.googleusercontent.com
EMAIL_CLIENT_SECRET=secret
EMAIL_REFRESH_TOKEN=token
```

### Installing example

This repository contains a script that deploys the most basic form of the application, to install it, docker needs to be installed in the machine, then run the script.

```
./deploy.sh
```

## Credits

- Jose Tow [[@Tow96](https://github.com/Tow96)]
