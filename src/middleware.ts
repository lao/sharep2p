import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {   
  const url = request.nextUrl.clone()   
  if (url.pathname === '/') {
    url.pathname = '/sender'
    return NextResponse.redirect(url)   
  } 
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: '/',
}
