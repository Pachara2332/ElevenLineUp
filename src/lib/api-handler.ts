
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface ApiContext {
  params: Record<string, string>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: any;
}

export class ApiHandler {
  static success<T>(data: T, status: number = 200): NextResponse<ApiResponse<T>> {
    return NextResponse.json({ success: true, data }, { status });
  }

  static error(message: string, status: number = 400, code?: string): NextResponse<ApiResponse> {
    return NextResponse.json({ success: false, error: message }, { status });
  }

  static handle(fn: (req: Request, ctx: ApiContext) => Promise<NextResponse>) {
    return async (req: Request, ctx: ApiContext) => {
      try {
        return await fn(req, ctx);
      } catch (error: any) {
        console.error('API Error:', error);

        if (error instanceof z.ZodError) {
          return ApiHandler.error('Validation Error', 400, 'VALIDATION_ERROR');
        }

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                return ApiHandler.error('Duplicate entry found', 409, 'DUPLICATE_ENTRY');
            }
        }

        return ApiHandler.error(error.message || 'Internal Server Error', 500, 'INTERNAL_ERROR');
      }
    };
  }
}
