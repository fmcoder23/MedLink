export function formatResponse(message: string, data: any) {
    return {
      status: 200,
      message,
      data,
    };
  }
  