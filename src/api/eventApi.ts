import api from "@/api/apiConfig"
// Get all events
export const getAllEvents = async () => {
  try {
    const res = await api.get("/event");
    return {success:true, events:res.data.events};
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};


export const eventRegister = async (eventId: string) => {
  try {
    const res = await api.post('/event/register', {eventId});
    return {success:true, event:res.data.event}
    
  } catch (error) {
    console.log("Error registering", error);
  }
}

export const createEvent = async (data:any) => {

  try {
    const res = await api.post('/event', data);
    return {success:res.data.success, event:res.data.event}
  } catch (error) {
    console.log(error)
  }

}
