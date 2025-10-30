import { useState } from "react"
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { useAuth } from "../context/AuthContext";
import { getAllUsers } from "../lib/data_store";


function Login() {

  const [selectedUserId, setSelectedUserId] = useState("");
  const {login} = useAuth();
  
  const users = getAllUsers();

  const handleLogin = () => {
    if (selectedUserId) {
      const user = users.find((u) => u.id === selectedUserId)
      if (user) {
        login(user)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl">Assignment Manager</CardTitle>
          <CardDescription>Select your account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select User</label>
            <select
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            >
              <option value="">Choose a user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
          <Button onClick={handleLogin} disabled={!selectedUserId} className="w-full">
            Login
          </Button>
          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
            <p>
              <strong>Demo Users:</strong>
            </p>
            <p>• John Student / Jane Student (Student role)</p>
            <p>• Prof. Admin (Admin role)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


export default Login