   import { useEffect, useState } from 'react'

   function App() {
     const [message, setMessage] = useState('Loading...')

     useEffect(() => {
       fetch(`${import.meta.env.VITE_API_URL}/api/health`)
         .then((res) => res.json())
         .then((data) => setMessage(data.message))
         .catch(() => setMessage('Could not reach the server'))
     }, [])

     return (
       <div>
         <h1>Smart Expense Tracker</h1>
         <p>Backend says: {message}</p>
       </div>
     )
   }

   export default App