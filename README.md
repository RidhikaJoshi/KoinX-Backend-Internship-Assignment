# KoinX-Backend-Internship-Assignment

KoinX Backend is a powerful and scalable server for managing cryptocurrency-related data and user interactions. This backend service connects to a MongoDB database and provides robust APIs for interacting with cryptocurrency data using the CoinGecko API. The project is designed to run efficiently using PM2 process management for handling multiple requests concurrently.

## Features

- **Node.js**: Built with Node.js v20.18.0 for optimal performance.
- **MongoDB Integration**: A seamless connection to MongoDB for storing and retrieving user and transaction data.
- **CoinGecko API**: Utilizes CoinGecko's API for fetching cryptocurrency prices and data.
- **Environment Configuration**: Secure API keys and sensitive data using environment variables.
- **PM2 Process Manager**: Ensures server stability and reliability, auto-restarting on failure.
- **Nginx Reverse Proxy**: Configured with Nginx for reverse proxy and SSL handling (for production environments).

## Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (v20.18.0)
- **MongoDB** (Database Connection)
- **PM2** (Process Manager)
- **Nginx** (For reverse proxy)

### Installation

1. **Clone the Repository**:

    ```bash
    git clone https://github.com/yourusername/koinx-backend.git
    ```

2. **Navigate to Project Directory**:

    ```bash
    cd koinx-backend
    ```

3. **Install Dependencies**:

    Run the following command to install all the necessary packages:

    ```bash
    npm install
    ```

4. **Set up Environment Variables**:

    Create a `.env` file in the project root and add the following variables:

    ```bash
    COINGECKO_API_KEY=your-coingecko-api-key
    MONGODB_URI="mongodb+srv://your-mongodb-uri"
    PORT=8000
    ```

5. **Start the Application**:

    Start the Node.js server using **PM2**:

    ```bash
    pm2 start index.js --name "KoinX-backend"
    ```

6. **Configure Nginx for Reverse Proxy** (Optional for Production):

    Edit your Nginx configuration file to route traffic to your Node.js app:

    ```bash
    sudo vi /etc/nginx/nginx.conf
    ```

    Add the following configuration:

    ```nginx
    server {
        listen 80;
        server_name KoinX-backend.ridhikajoshi.me;

        location / {
            proxy_pass http://localhost:8000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

    Then reload Nginx:

    ```bash
    sudo nginx -s reload
    ```

7. **Check the Status**:

    Use PM2 to view the running status of your application:

    ```bash
    pm2 list
    ```



## Technologies Used

- **Node.js**: Server-side JavaScript runtime.
- **MongoDB**: NoSQL database for storing user and transaction data.
- **CoinGecko API**: External API for fetching cryptocurrency data.
- **PM2**: Process management for Node.js applications.
- **Nginx**: Web server for reverse proxy setup in production.

## Contributing

Feel free to submit issues or pull requests. For major changes, please open an issue first to discuss what you would like to change.

### Steps for contributing:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License.
