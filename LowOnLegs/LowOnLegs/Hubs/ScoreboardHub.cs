using Microsoft.AspNetCore.SignalR;

namespace LowOnLegs.API.Hubs
{
    public class ScoreboardHub: Hub
    {
        public async Task SendScoreUpdate(int leftPlayerScore, int rightPlayerScore)
        {
            await Clients.All.SendAsync("UpdateScore", new 
            { 
                leftPlayer = leftPlayerScore, 
                rightPlayer = rightPlayerScore
            });
        }
    }
}
