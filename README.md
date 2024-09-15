# Zen Inventory App
## Stack Used
![Stack Picture](https://github.com/user-attachments/assets/09bb8a8b-02bb-47ca-a6bd-51b9f4c52932)
For the Backend, Django(Python) is used to handle API calls to the database. PostgreSQL is used for the database. Vite(React) is used for the frontend structure. For the push notifications, Firebase Cloud Messaging(FCM) is used. The backend is hosted on Heroku, and the frontend is hosted on Netlify.

## App Description
This progressive web app(PWA) is for all Zen Ramen and Sushi Burritos franchises in Washington. As the franchise holds multiple locations across Washington, the client requested to make an app for their inventory management. The owners of each location can send the order for their inventory to the franchise manager. Then, the franchise manager can distribute the items that are ordered by the owners to each location.
## App View
# Start Page
![Zen Initial](https://github.com/user-attachments/assets/45381fc7-20a4-48b1-8852-d060d11cdbb4)
# Log In Page
![Zen Log In](https://github.com/user-attachments/assets/5b08bb20-a3cf-4584-a96c-385d4b7c2fed)
# Register Page
![Zen Register](https://github.com/user-attachments/assets/360bcde5-9d80-4458-9232-9f108eb1e142)
# Manager Home
![Zen Manager Home](https://github.com/user-attachments/assets/89cd0e0b-746b-4eb4-a154-8e13c57d94f2)
# Owner Home
![Zen Worker Home](https://github.com/user-attachments/assets/891bd765-a7a7-4fd9-ab8a-a71d91ebc97f)
![Zen Worker Home with Pending Order](https://github.com/user-attachments/assets/e82dc76d-9e49-490e-8b3a-d52e12f36d6d)
When the user creates an order, Home adds one more button that can lead to the pending order's detail page.
# Order Form Page
![Order Create 1](https://github.com/user-attachments/assets/9b13db2a-059c-4804-9c62-ba31c09d9fdc)
![Order Create 2](https://github.com/user-attachments/assets/5fbd75c9-fabb-41eb-9b55-a703a6ec1d46)
![Worker Order Update](https://github.com/user-attachments/assets/7f0c2e83-1407-4afe-80ee-bf3beaf4768d)
Order create and update pages share the same format and structure. However, the only difference is that the title is different according to the action that the user is trying to take.
# Manager Order Detail
![Manager Pending Order Detail](https://github.com/user-attachments/assets/590a7aab-a575-4578-9100-1ed9b2acbce7)
![Manager Completed Order Detail](https://github.com/user-attachments/assets/49ac5d72-7060-4fc5-a8d2-47689b5217c8)
The difference between the two pages is that the mark as completed button disappears when the order is completed.
# Owner Order Detail
![Worker Pending Order Detail](https://github.com/user-attachments/assets/3aa01e2a-6045-4e42-a16b-9c551166772c)
![Worker Completed Order Detail](https://github.com/user-attachments/assets/3641882c-7ec1-402b-9092-afad5ebb8a74)
The difference between the two pages is that the order update button disappears when the order is completed.
# Order List
![Manager Pending Orders](https://github.com/user-attachments/assets/4bd8663f-9167-47ca-8269-4d155c980fee)
![Manager Completed Order](https://github.com/user-attachments/assets/8aaa112e-795a-4b1b-991a-f7078ad36bed)
![Worker Order List](https://github.com/user-attachments/assets/97564163-ecf8-40c4-b35e-3c18b33ba13a)
The format of the list is the same. However, the franchise manager can filter orders by location.
