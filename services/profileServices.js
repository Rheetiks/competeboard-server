const axios = require('axios');

exports.fetchUserStatus = async (username) => {
    const url = `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`;
    const response = await axios.get(url);
    return response.data
};

exports.fetchUserInfo = async (username) => {
    const url = `https://codeforces.com/api/user.info?handles=${username}`;
    const response = await axios.get(url);

    return response.data;
};

exports.fetchUserRating = async (username) => {
    const url = `https://codeforces.com/api/user.rating?handle=${username}`;
    const response = await axios.get(url);
    return response.data;
};

exports.fetchCodeChefUserData = async (username) => {
    const url = `https://codechef-api.vercel.app/handle/${username}`;
    const response = await axios.get(url);
    let data = response.data;
    data.heatMap = []
    return data;
};



exports.fetchUserCombinedData = async (username) => {
    const query = `
    query userCombinedData($username: String!) {
        userContestRanking(username: $username) {
            attendedContestsCount
            rating
            globalRanking
            totalParticipants
            topPercentage
            badge {
                name
            }
        }
        matchedUser(username: $username) {
            profile {
                ranking
            }
            submitStats: submitStatsGlobal {
                acSubmissionNum {
                    difficulty
                    count
                    submissions
                }
            }
        }
    }`;

    const variables = {
        username: username,
    };

    const response = await fetch("https://leetcode.com/graphql", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
        contestRanking: data?.data?.userContestRanking,
        publicProfileRanking: data?.data?.matchedUser?.profile?.ranking,
        submissionStats: data?.data?.matchedUser?.submitStats?.acSubmissionNum,
    };
};

