
class ApiResponse {
    statusCode: number;
    data: any;
    message: string;
    success: boolean;

    constructor(statusCode: number, data: any, message = "Success") {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = statusCode >= 200 && statusCode < 300;
    }
  }
  export { ApiResponse };
  