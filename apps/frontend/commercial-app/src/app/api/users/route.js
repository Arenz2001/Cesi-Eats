// Fake users data
const users = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 2, name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: 3, name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: 4, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 5, name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: 6, name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: 7, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 8, name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: 9, name: 'Michael Brown', email: 'michael.brown@example.com' },
  { id: 10, name: 'John Smith', email: 'john.smith@example.com' },
  { id: 11, name: 'Emily Johnson', email: 'emily.johnson@example.com' },
  { id: 12, name: 'Michael Brown', email: 'michael.brown@example.com' },
];

export async function GET() {
  return Response.json(users);
}

export async function POST(request) {
  const body = await request.json();
  
  const newUser = {
    id: users.length + 1,
    ...body
  };
  
  users.push(newUser);
  
  return Response.json(newUser, { status: 201 });
} 