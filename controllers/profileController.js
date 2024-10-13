const UserHandles = require('../models/UserHandles');

const {
    fetchUserStatus,
    fetchUserInfo,
    fetchUserRating,
    fetchCodeChefUserData,
    fetchUserCombinedData, 
} = require('../services/profileServices');

const getProfilesData = async (req, res) => {
    const userId = req.user.userId; 

    try {
        const userHandles = await UserHandles.findOne({ userId });

        if (!userHandles) {
            return res.status(404).json({ message: 'User handles not found' });
        }

        const { codeforces, codechef, leetcode } = userHandles; 
        const profilesData = {}; 

        if (codeforces && codeforces.trim() !== '') {
            const [statusData, infoData, ratingData] = await Promise.all([
                fetchUserStatus(codeforces),
                fetchUserInfo(codeforces),
                fetchUserRating(codeforces),
            ]);
            const data = statusData?.result;
            const filteredData = data.filter(item => item.verdict === "OK");
            const problemSolved = filteredData.reduce((acc, item) => {
                const rating = item.problem.rating;
                if (!acc.processedProblems.has(item.problem.name)) {
                    acc.processedProblems.add(item.problem.name);

                    if (rating === undefined || rating === null || isNaN(rating) || rating < 1000) {
                        acc['<1000'] += 1;
                    } else if (rating >= 1000 && rating <= 2000) {
                        acc['1000-2000'] += 1;
                    } else if (rating > 2000) {
                        acc['>2000'] += 1;
                    }
                }

                return acc;
            }, { '<1000': 0, '1000-2000': 0, '>2000': 0, processedProblems: new Set() });

            profilesData.codeforces = {
                problemSolved: problemSolved,
                submissions: data,
                info: infoData,
                rating: ratingData,
            };
        }

        if (codechef && codechef.trim() !== '') {
            const codeChefData = await fetchCodeChefUserData(codechef);
            profilesData.codechef = codeChefData;
        }

        if (leetcode && leetcode.trim() !== '') {
            const leetcodeData = await fetchUserCombinedData(leetcode);
            profilesData.leetcode = leetcodeData;
        }

        res.status(200).json(profilesData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profiles data', details: error.message });
    }
};

const addOrUpdateUserHandles = async (req, res) => {
    const { codeforces, codechef, leetcode } = req.body; 
    const userId = req.user.userId; 

    try {
        let userHandles = await UserHandles.findOne({ userId });

        if (userHandles) {
            userHandles.codeforces = codeforces || userHandles.codeforces;
            userHandles.codechef = codechef || userHandles.codechef;
            userHandles.leetcode = leetcode || userHandles.leetcode;

            await userHandles.save();
        } else {
            userHandles = new UserHandles({ userId, codeforces, codechef, leetcode });
            await userHandles.save();
        }

        res.status(200).json({ message: 'User handles added/updated successfully', userHandles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add/update user handles', details: error.message });
    }
};

module.exports = {
    getProfilesData,
    addOrUpdateUserHandles,
};
