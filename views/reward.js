function reward(reward) {
    console.log(reward);

    for (let index = 0; index < reward.length; index++) {
        if (reward[index].status === 100) {
            return alert('You got an award for completing the task ' + reward[index].name);
        }
    }
    alert('Sorry No Reward, please complete the task');
}