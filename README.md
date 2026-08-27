# FreelanceHub — Full-Stack Freelancing Marketplace

A full-stack freelancing marketplace that connects clients with freelancers, allowing users to create projects, submit proposals, communicate through real-time chat, and manage the complete project workflow.

## Overview

FreelanceHub was developed as a full-stack project to gain practical experience building and deploying a production-style web application.

The application includes authentication, role-based access, project management, proposal handling, reviews, conversations, messaging, and real-time communication using Socket.IO.

## Features

### Authentication & Authorization

* User registration and login
* JWT-based authentication
* HTTP-only authentication cookies
* Role-based access for Clients and Freelancers
* Protected API routes
* Protected Socket.IO connections
* Participant-level authorization for conversations

### Client Features

* Create and manage projects
* View proposals from freelancers
* Review freelancer proposals
* Communicate with freelancers
* Accept or reject proposals
* Review completed work/freelancers

### Freelancer Features

* Browse available projects
* Submit proposals
* Manage submitted proposals
* Communicate with clients
* Track project-related conversations
* Receive client reviews

### Real-Time Chat

* Real-time messaging using Socket.IO
* Conversation-specific Socket.IO rooms
* Authenticated socket connections
* Participant verification before joining conversations
* Real-time message broadcasting
* REST API fallback for sending messages
* Persistent messages stored in MongoDB

## Tech Stack

### Frontend

* React.js
* JavaScript
* Tailwind CSS
* React Hooks
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* Mongoose

### Database

* MongoDB

### Authentication & Security

* JWT
* HTTP-only Cookies
* Helmet
* CORS
* Rate Limiting
* Input Validation
* Protected REST APIs
* Protected Socket.IO connections
* Role-based authorization

### Development & Deployment

* Git
* GitHub
* Environment Variables
* REST APIs
* Socket.IO
* Production Deployment

## Main Application Workflow

```text
Client
  │
  ├── Creates Project
  │
  └── Receives Freelancer Proposals
            │
            ▼
       Proposal System
            │
            ▼
       Conversation
            │
            ├── REST API
            │
            └── Socket.IO
                    │
                    ▼
              Real-Time Chat
```

## Real-Time Communication

The application uses Socket.IO for real-time communication between clients and freelancers.

Each conversation has its own Socket.IO room, and the backend verifies that the authenticated user belongs to the conversation before allowing the socket connection to join the room.

Messages are persisted in MongoDB, while Socket.IO is used to deliver new messages to connected participants in real time.

## Security

Several security practices were implemented throughout the application:

* JWT authentication
* HTTP-only cookies
* Role-based authorization
* Protected REST endpoints
* Protected Socket.IO connections
* Conversation participant verification
* Conversation-specific Socket.IO rooms
* Helmet security headers
* CORS configuration
* Rate limiting
* Input validation
* Server-side authorization checks

## What I Learned

This project helped me gain practical experience with:

* Building a full-stack application from frontend to backend
* Designing REST APIs with Express.js
* Working with MongoDB and Mongoose
* Implementing JWT authentication
* Working with HTTP-only cookies
* Implementing role-based authorization
* Connecting React applications with REST APIs
* Building real-time communication with Socket.IO
* Working with Socket.IO rooms and events
* Authenticating Socket.IO connections
* Performing server-side participant authorization
* Handling real-time and REST-based communication together
* Debugging frontend/backend integration issues
* Configuring CORS and security middleware
* Managing environment variables
* Deploying a full-stack application

## Demo


### Freelancer Dashboard

<!-- Add screenshot here -->

<p align="center">
  <img src="./screenshots/freelancer_1.png" alt="Freelancer Dashboard" width="800">
</p>

### Project & Proposal System

<!-- Add screenshot here -->

<p align="center">
  <img src="./screenshots/freelancer_2.png" alt="Project and Proposal System" width="800">
</p>
<p align="center">
  <img src="./screenshots/freelancer_4.png" alt="Project and Proposal System" width="800">
</p>


### Real-Time Chat

<!-- Add screenshot here -->

<p align="center">
  <img src="./screenshots/freelancer_7.png" alt="Real-Time Chat" width="800">
</p>

## Project Structure

```text
FreelanceHub/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── ...
│   │
│   └── ...
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── socket/
│   └── ...
│
└── README.md
```

## Purpose

The main purpose of FreelanceHub was to build a practical full-stack application while gaining hands-on experience with authentication, authorization, REST APIs, databases, real-time communication, security practices, and deployment.

## Project Status

**Completed and Deployed**

This project is available as a portfolio project demonstrating full-stack web development and practical backend development skills.
