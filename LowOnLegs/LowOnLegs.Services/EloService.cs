namespace LowOnLegs.Services
{
    public static class EloService
    {
        private const int K = 32;

        public static (int winnerNewElo, int loserNewElo) Calculate(int winnerElo, int loserElo)
        {
            double expectedWinner = 1.0 / (1.0 + Math.Pow(10, (loserElo - winnerElo) / 400.0));
            double expectedLoser = 1.0 - expectedWinner;

            int winnerNew = (int)Math.Round(winnerElo + K * (1.0 - expectedWinner));
            int loserNew = (int)Math.Round(loserElo + K * (0.0 - expectedLoser));

            return (winnerNew, loserNew);
        }

        // For doubles: uses average team ELO, returns delta applied to each player
        public static int CalculateDoubleDelta(int winnerTeamAvgElo, int loserTeamAvgElo)
        {
            double expectedWinner = 1.0 / (1.0 + Math.Pow(10, (loserTeamAvgElo - winnerTeamAvgElo) / 400.0));
            return (int)Math.Round(K * (1.0 - expectedWinner));
        }
    }
}
