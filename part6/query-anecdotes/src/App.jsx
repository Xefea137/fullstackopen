import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch, useNotificationValue } from './NotificationContext'

const App = () => {
  const notification = useNotificationValue()
  const notificationDispatch = useNotificationDispatch()
  const queryClient = useQueryClient()

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (updatedAnecdote) => {
      //queryClient.invalidateQueries({ queryKey: ['anecdotes'] })      
      //queryClient.invalidateQueries('anecdotes')
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(anecdote => 
        anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote))            
    }
  })

  const handleVote = async (anecdote) => {
    await updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    notificationDispatch({ type: 'showNotification', payload: `Ancedote '${anecdote.content}' voted!` })
    setTimeout(() => {
      notificationDispatch({ type: 'hideNotification' })      
    }, 5000)
  }

  const result = useQuery({ 
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })
  //console.log(JSON.parse(JSON.stringify(result)))

  if ( result.isLoading ) {
    return <div>loading data...</div>
  }

  if ( result.isError ) {
    return <h1>Anecdote service not available due to problems in server!</h1>
  }
  
  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
    
      <Notification notification={notification}/>
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
