

var teamNZ = ["Central Pulse", "Northern Mystics", "Waikato Bay of Plenty Magic", "Southern Steel","Canterbury Tactix"];
var teamAU = ["New South Wales Swifts", "Adelaide Thunderbirds", "Melbourne Vixens","West Coast Fever","Queensland Firebirds"];
var overallTeams = ["all", "nz", "aus"];
var comparisonMode = false;


    d3.csv("data/ANZ_Championship/2008-Table1.csv", function (error1, data2008) {
    d3.csv("data/ANZ_Championship/2009-Table1.csv", function (error1, data2009) {
    d3.csv("data/ANZ_Championship/2010-Table1.csv", function (error1, data2010) {
    d3.csv("data/ANZ_Championship/2011-Table1.csv", function (error1, data2011) {
    d3.csv("data/ANZ_Championship/2012-Table1.csv", function (error1, data2012) {
    d3.csv("data/ANZ_Championship/2013-Table1.csv", function (error1, data2013) {
        var NetBallList = [];
        var seasonTime = {
            whole: 0,
            early: 1,
            mid: 2,
            late: 3
        };
        var currentYear = 0;
        var currentSeasonTime = seasonTime.whole;
        var currentTeam ="Northern Mystics";
        var currentdata = data2008;


        //Returns an array of awaywins, homewins, awayloss, homeloss, total
        var winStatitisticsArray = function (year,team) {
            var homewins = 0;
            var awaywins = 0;
            var homeloss = 0;
            var awayloss = 0;
            var wins = 0;
            var total = 0;
            setCurrentData(year,team);
            currentdata.forEach(function (d) {
                //console.log(d);
                if (isCurrentTeam(d["Away Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away > home)
                        awaywins++;
                    else
                        awayloss++;
                    total++;

                } else if (isCurrentTeam(d["Home Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away < home)
                        homewins++;
                    else
                        homeloss++;
                    total++;
                }
            });
            //console.log("awaywins: " +awaywins);
            //console.log("homewins: " +homewins);
            //console.log("awayloss: " +awayloss);
            //console.log("homeloss: " +homeloss);
            //console.log("total: " +total);
            return [awaywins,homewins,awayloss,homeloss,total];
        };


        //finds the win percentage ie wins/totalgames
         var winPercentage = function(year,team){
            var winsArray = winStatitisticsArray(year,team);
            var awaywins = winsArray[0];
            var homewins = winsArray[1];
            var total = winsArray[4];
            return parseInt((awaywins + homewins)/total*100);
        };

        //finds the home win percentage over all home games
        var homewinPercentage = function(year,team){
            var winsArray = winStatitisticsArray(year,team);
            var homewins = winsArray[1];
            var homeloss = winsArray[3];
            var totalhome = homewins + homeloss;
            return parseInt(homewins/totalhome*100);
        };

        //finds the away win percentage over all away games
        var awaywinPercentage = function(year,team){
            var winsArray = winStatitisticsArray(year,team);
            var awaywins = winsArray[0];
            var awayloss = winsArray[2];
            var totalaway = awaywins + awayloss;
            return parseInt(awaywins/totalaway*100);
        };

        /**
         * Finds the average score of the current team
         * @returns {Number}
         */
        var averageScore = function (year,team) {
            var totalscore = 0;
            var total = 0;
            setCurrentData(year,team);
            currentdata.forEach(function (d) {
                if (isCurrentTeam(d["Away Team"])) {
                    var score = d.Score;
                    var away = d.Score.substring(3, 5);
                    totalscore=totalscore  +parseInt(away);
                    total++;

                } else if (isCurrentTeam(d["Home Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    totalscore = totalscore +parseInt(home);
                    total++;
                }
            });

            //console.log("totalscore: " +totalscore);
            //console.log("total: " +total);
            return parseInt(totalscore/total);
        };

        /**
         * Finds the best streak ie top number of wins in a row
         * @returns {number} top number of wins in a row
         */
        var currentStreak = function (year,team) {
            var topstreak = 0;
            var currentstreak = 0;
            setCurrentData(year,team);
            currentdata.forEach(function (d) {
                if (isCurrentTeam(d["Away Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away > home) { //win add 1 to streak
                        //console.log("win");
                        currentstreak++;
                    }
                    else {//lose check streak and reset currentstreak
                        //console.log("lose");
                        if (currentstreak > topstreak) {
                            topstreak = currentstreak;
                        }
                        currentstreak = 0;
                    }

                } else if (isCurrentTeam(d["Home Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away < home) { //win add 1 to streak
                        //console.log("win");
                        currentstreak++;
                    }
                    else { //lose check streak and reset currentstreak
                        //console.log("lose");
                        if (currentstreak > topstreak) {
                            topstreak = currentstreak;
                        }
                        currentstreak = 0;
                    }
                }
            });
            if (currentstreak > topstreak) {
                topstreak = currentstreak;
            }
            //console.log("currentstreak: " +currentstreak);
            //console.log("topstreak: " +topstreak);
            return topstreak;
        };

        /**
         * Finds the top 5 best venue of the current team and their percentage win
         * @returns {Array} array of the top 5 best venues
         */
        var bestVenue = function (year,team) {
            var venuemap = {};
            setCurrentData(year,team);
            currentdata.forEach(function (d) {
                if (isCurrentTeam(d["Away Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away > home) { //win
                        //console.log("win " + d.Venue +" " + away + " " + home);
                        if (d.Venue in venuemap) {
                            venuemap[d.Venue] = {
                                wins: venuemap[d.Venue].wins+1,
                                loss: venuemap[d.Venue].loss,
                                venue: "away"
                            };
                        } else {
                            venuemap[d.Venue] = {
                                wins:1,
                                loss:0,
                                venue: "away"
                            };
                        }
                    }
                    else {//lose
                        //console.log("lose " + d.Venue +" " + away + " " + home);
                        if (d.Venue in venuemap) {
                            venuemap[d.Venue] = {
                                wins: venuemap[d.Venue].wins,
                                loss: venuemap[d.Venue].loss+1,
                                venue: "away"
                            };
                        } else {
                            venuemap[d.Venue] = {
                                wins:0,
                                loss:1,
                                venue: "away"
                            };
                        }
                    }

                } else if (isCurrentTeam(d["Home Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away < home) { //win
                        //console.log("win " + d.Venue +" " + home + " " + away);
                        if (d.Venue in venuemap) {
                            venuemap[d.Venue] = {
                                wins: venuemap[d.Venue].wins+1,
                                loss: venuemap[d.Venue].loss,
                                venue: "home"
                            };
                        } else {
                            venuemap[d.Venue] = {
                                wins:1,
                                loss:0,
                                venue: "home"
                            };
                        }
                    }
                    else {//lose
                        //console.log("lose " + d.Venue +" " + home + " " + away);
                        if (d.Venue in venuemap) {
                            venuemap[d.Venue] = {
                                wins: venuemap[d.Venue].wins,
                                loss: venuemap[d.Venue].loss+1,
                                venue: "home"
                            };
                        } else {
                            venuemap[d.Venue] = {
                                wins:0,
                                loss:1,
                                venue: "home"
                            };
                        }
                    }
                }
            });
            //console.log(venuemap);
            //Finds 5 best venue in the venuemap
            var topvenues =[];
            for(var i =0; i<5; i++){
                var bestvenue = "";
                var bestvenuepercentagewin = -1;
                for(var v in venuemap){
                    var wins = venuemap[v].wins;
                    var loss = venuemap[v].loss;
                    var currentpercentage = parseInt(wins/(wins + loss)*100);
                    if(currentpercentage>bestvenuepercentagewin){
                        bestvenue = v;
                        bestvenuepercentagewin = currentpercentage;
                    }
                }
                topvenues.push({
                    venue:bestvenue,
                    percentage: bestvenuepercentagewin
                });
                delete venuemap[bestvenue];
            }
            return topvenues;
        };

        /**
         * Finds the placing of the current team
         * Restriction:
         * current team must be a single team
         * year must be a single year
         * Season must be the whole season
         */
        var placing = function(year,team){
            setCurrentData(year,team);
            if(currentdata.length==0) return 5;
            var match =currentdata[currentdata.length-1];
            var home = match.Score.substring(0, 2);
            var away = match.Score.substring(3, 5);
            //finals
            if(match.Round==17) {
                if (match["Away Team"] == currentTeam) {
                    if (away > home) return 1;
                    else return 2;
                }
                else if (match["Home Team"] == currentTeam) {
                    if (away < home) return 1;
                    else return 2;
                }
            }
            //3rd place
            else if(match.Round==16) {
                if (match["Away Team"] == currentTeam) {
                    if (away < home) return 3;
                }
                else if (match["Home Team"] == currentTeam) {
                    if (away > home) return 3;
                }
            }

            //4th place
            else if(match.Round ==15) {
                if (match["Away Team"] == currentTeam) {
                    if (away < home) return 4;
                }
                else if (match["Home Team"] == currentTeam) {
                    if (away > home) return 4;
                }
            }

            return 5;
        }

        var rival = function(year,team){
            var matchmap = {};
            setCurrentData(year,team);
            currentdata.forEach(function (d) {
                if (isCurrentTeam(d["Away Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away > home) { //win
                        //console.log("win " + d["Home Team"] +" " + away + " " + home);
                        if (d["Home Team"] in matchmap) {
                            matchmap[d["Home Team"]] = {
                                wins: matchmap[d["Home Team"]].wins+1,
                                loss: matchmap[d["Home Team"]].loss
                            };
                        } else {
                            matchmap[d["Home Team"]] = {
                                wins: 1,
                                loss: 0
                            };
                        }
                    }
                    else {//lose
                        //console.log("lose " + d["Home Team"] +" " + away + " " + home);
                        if (d["Home Team"] in matchmap) {
                            matchmap[d["Home Team"]] = {
                                wins: matchmap[d["Home Team"]].wins,
                                loss: matchmap[d["Home Team"]].loss+1
                            };
                        } else {
                            matchmap[d["Home Team"]] = {
                                wins: 0,
                                loss: 1
                            };
                        }
                    }

                } else if (isCurrentTeam(d["Home Team"])) {
                    var score = d.Score;
                    var home = d.Score.substring(0, 2);
                    var away = d.Score.substring(3, 5);
                    if (away < home) { //win
                        //console.log("win " + d["Away Team"] +" " + home + " " + away);
                        if (d["Away Team"] in matchmap) {
                            matchmap[d["Away Team"]] = {
                                wins: matchmap[d["Away Team"]].wins+1,
                                loss: matchmap[d["Away Team"]].loss
                            };
                        } else {
                            matchmap[d["Away Team"]] = {
                                wins: 1,
                                loss: 0
                            };
                        }
                    }
                    else {//lose
                        //console.log("lose " + d["Away Team"] +" " + home + " " + away);
                        if (d["Away Team"] in matchmap) {
                            matchmap[d["Away Team"]] = {
                                wins: matchmap[d["Away Team"]].wins,
                                loss: matchmap[d["Away Team"]].loss+1
                            };
                        } else {
                            matchmap[d["Away Team"]] = {
                                wins: 0,
                                loss: 1
                            };
                        }
                    }
                }
            });
            //Finds 5 best rivalries in the matchmap
            var toprival =[];
            for(var i =0; i<5; i++){
                var bestrival = "";
                var bestrivalpercentagewin = -1;
                for(var v in matchmap){
                    var wins = matchmap[v].wins;
                    var loss = matchmap[v].loss;
                    var currentbestrivalpercentagewin = parseInt(wins/(wins + loss)*100);
                    if(currentbestrivalpercentagewin>=25 && currentbestrivalpercentagewin<=75){
                        if(currentbestrivalpercentagewin>bestrivalpercentagewin){
                            bestrival = v;
                            bestrivalpercentagewin = currentbestrivalpercentagewin;
                        }
                    }

                }
                toprival.push({
                    rival:bestrival,
                    percentage: bestrivalpercentagewin
                });
                delete matchmap[bestrival];
            }
            return toprival;
        };

        var printStats = function() {
            console.log("currentTeam " + currentTeam);
            console.log("currentYear " + currentYear);
            console.log("currentSeasonTime " + currentSeasonTime);
            console.log("placing " + placing());
            console.log("Win Percentage: " + winPercentage() + "%");
            console.log("Average score: " + parseInt(averageScore()) + " goals");
            console.log("Top streak: " + currentStreak() + " wins in a row");
            console.log("homewinPercentage: " + homewinPercentage() + "% home wins over all home games");
            console.log("awaywinPercentage: " + awaywinPercentage() + "% away wins over all away games")
            console.log("best venue\n" +
                "1. " + bestVenue()[0].venue + " - " + bestVenue()[0].percentage + "% \n " +
                "2. " + bestVenue()[1].venue + " - " + bestVenue()[1].percentage + "% \n " +
                "3. " + bestVenue()[2].venue + " - " + bestVenue()[2].percentage + "% \n " +
                "4. " + bestVenue()[3].venue + " - " + bestVenue()[3].percentage + "% \n " +
                "5. " + bestVenue()[4].venue + " - " + bestVenue()[4].percentage + "% \n "
            );
            console.log("best rival\n" +
                "1. " + rival()[0].rival + " - " + rival()[0].percentage + "% \n " +
                "2. " + rival()[1].rival + " - " + rival()[1].percentage + "% \n " +
                "3. " + rival()[2].rival + " - " + rival()[2].percentage + "% \n " +
                "4. " + rival()[3].rival + " - " + rival()[3].percentage + "% \n " +
                "5. " + rival()[4].rival + " - " + rival()[4].percentage + "% \n "
            );

        };


        //Helper methods

        function isNZ (team){
            for(var s in teamNZ){
                if(teamNZ[s] == team)
                    return true;
            }
            return false;
        }

        /**
         * Compares two teams to see if they are the same
         * @param otherTeam - team to compare with
         * @param team - optional parameter otherwise it is currentTeam
         * @returns {boolean}
         */
        function isCurrentTeam(otherTeam,team){
            team = team || currentTeam;
            if(team == otherTeam) return true;
            else if(team == "all") return true;
            else if(team == "nz" && isNZ(otherTeam))return true;
            else if(team == "aus" && !isNZ(otherTeam))return true;
            return false;
        }

        /**
         * Filters the currentData array by the team and season time and year.
         * This method can be called after each year/team/seasontime change. (button press)
         * @param year - optional parameter otherwise it is currentYear
         * @param team - optional parameter otherwise it is currentTeam
         */
        function setCurrentData(year,team) {
            year = year || currentYear;
            team = team || currentTeam;
            if (year == 2008) currentdata = data2008;
            else if (year == 2009) currentdata = data2009;
            else if (year == 2010) currentdata = data2010;
            else if (year == 2011) currentdata = data2011;
            else if (year == 2012) currentdata = data2012;
            else if (year == 2013) currentdata = data2013;
            else if (year == 0)currentdata =
                data2008.concat(data2009).concat(data2010).
                    concat(data2011).concat(data2012).concat(data2013);
            else console.log(year + " is not a valid year");

            var newData = [];
            for (var d in currentdata) {
                //If there is a bye - skip
                if (currentdata[d].Score == "")
                    continue;
                //If there is a draw - skip
                else if (currentdata[d].Score.substring(0, 4) == "draw")
                    continue;
                //If away team
                else if (isCurrentTeam(currentdata[d]["Away Team"],team) && inSeasonTime(currentdata[d].Round)) {
                    newData.push(currentdata[d]);
                //If home team
                } else if (isCurrentTeam(currentdata[d]["Home Team"],team) && inSeasonTime(currentdata[d].Round)) {
                    newData.push(currentdata[d]);
                }
                currentdata[d].Score = currentdata[d].Score.replace(/ /g,''); // removes whitespace
            }
            currentdata = newData;
            //console.log(currentdata);
            //console.log("currentSeasonTime " + currentSeasonTime);
            //console.log("currentTeam " + currentTeam);
            //console.log("currentYear " + currentYear);
        };

        /**
         * Helper method for setCurrentData() checks that the current round is in the currentSeasonTime
         * @param round The round of the netball match
         * @returns {boolean} whether in season time
         */
        function inSeasonTime(round){
            if(currentSeasonTime== seasonTime.early){
                if(round<=7)
                    return true;
                return false;
            }
            else if(currentSeasonTime== seasonTime.mid){
                if(round>7 && round <=14)
                    return true;
                return false;
            }
            else if(currentSeasonTime== seasonTime.late){
                if(round>14)
                    return true;
                return false;
            }
            else { // whole
                return true;
            }
        }


        // GUI related-------------------------------------------------------------------------------------

        var years = ["All", 2008, 2009, 2010, 2011, 2012, 2013];
        //var seasons = ["Whole", "Early", "Mid", "Finals"];
        var selectorYear = document.getElementById("selector-year");

        for (var i = 0; i < years.length; i++) {
            opt = document.createElement("option");
            opt.value = years[i];
            opt.innerHTML = years[i];
            selectorYear.appendChild(opt);
        }

        var selectorSeason = document.getElementById("selector-season");

        for (var key in seasonTime) {
            opt = document.createElement("option");
            opt.value = seasonTime[key];
            opt.innerHTML = key;
            selectorSeason.appendChild(opt);
        }

        var selectorTeam = document.getElementById("selector-team");
        var selectorTeam2 = document.getElementById("selector-team2");
        var bothTeams = Array.prototype.concat(teamAU, teamNZ, overallTeams);
        bothTeams.sort();
        for (i = 0; i < bothTeams.length; i++) {
            opt = document.createElement("option");
            opt.value = bothTeams[i];
            opt.innerHTML = bothTeams[i];
            selectorTeam.appendChild(opt);
            selectorTeam2.appendChild(opt.cloneNode(true));
        }

        function selectorChange() {
            currentYear = years[selectorYear.selectedIndex];
            if(years[selectorYear.selectedIndex] === "All" ){
                currentYear = 0;
            }
            currentSeasonTime = selectorSeason.options[selectorSeason.selectedIndex].value;
            currentTeam = selectorTeam.options[selectorTeam.selectedIndex].value;

            setCurrentData();
            if(!comparisonMode) {
                drawAvgScore(averageScore());
                drawPlacing(placing());
                drawStreak(currentStreak());
                drawWinLoss(winPercentage());
                drawHomeWinPercentage(homewinPercentage());
                drawAwayWinPercentage(awaywinPercentage());
                drawTopFiveVenues(bestVenue());
                drawRivalTeams(rival());
                printStats();
            }else {
                var team2 = selectorTeam2.options[selectorTeam2.selectedIndex].value;
                if(currentTeam === team2){
                    selectorTeam2.style.background = "#333";
                    selectorTeam.style.background = "#333";
                    //selectorTeam2.options[selectorTeam2.selectedIndex].style.background = "red";
                    return;
                }else{
                    selectorTeam2.style.background = "";
                    selectorTeam.style.background = "";
                    //selectorTeam2.options[selectorTeam2.selectedIndex].background = "";
                }

                var wlData = [{team: currentTeam, win: winPercentage(), loss: 100 - winPercentage()},
                    {
                        team: team2,
                        win: winPercentage(currentYear, team2),
                        loss: 100 - winPercentage(currentYear, team2)
                    }];
                drawComparisonWinLoss(wlData);
                var hwData = [{team: currentTeam, win: homewinPercentage(), loss: 100 - homewinPercentage()},
                    {
                        team: team2,
                        win: homewinPercentage(currentYear, team2),
                        loss: 100 - homewinPercentage(currentYear, team2)
                    }];
                drawComparisonHomeWins(hwData);
                var awData = [{team: currentTeam, win: awaywinPercentage(), loss: 100 - awaywinPercentage()},
                    {
                        team: team2,
                        win: awaywinPercentage(currentYear, team2),
                        loss: 100 - awaywinPercentage(currentYear, team2)
                    }];
                drawComparisonAwayWins(awData);
            }
        }

        document.getElementById("selectors")
            .addEventListener("change", selectorChange);
        var addBtn = document.createElement("a");
        addBtn.className = "btn btn-default";
        addBtn.innerHTML = "Add Team";
        addBtn.addEventListener("click", function(event){
            var team2 = document.getElementById("input-group-team2");
            if(team2.classList.contains("in")){
                team2.classList.remove("in");
                addBtn.innerHTML = "Add Team";
                comparisonMode = false;
                document.getElementById("non-comparisons").classList.remove("hidden");
                document.getElementById("comparisons").classList.add("hidden");
            }else {
                team2.classList.add("in");
                addBtn.innerHTML = "Remove Comparison Team";
                comparisonMode = true;
                document.getElementById("comparisons").classList.remove("hidden");
                document.getElementById("non-comparisons").classList.add("hidden");

            }
            selectorChange();
        });

        var li = document.createElement("li");
        li.appendChild(addBtn);
        document.getElementById("selectors").appendChild(li);
        selectorChange();
        var fullscreen = document.getElementById("fullscreen");
        var title = document.getElementById("FS-title");
        var graph = document.getElementById("FS-graph");
        fullscreen.addEventListener("click", function(){
            fullscreen.classList.remove("open");
            fullscreen.classList.add("close");
        });

        document.getElementById("win-loss-details").addEventListener("click", function(){
            fullscreen.classList.remove("close");
            fullscreen.classList.add("open");
            var histYears = years.slice(1);
            var history = [];
            histYears.forEach(function(e){
                //setCurrentData(e, currentTeam);
                history.push({year: e, win: winPercentage(e, currentTeam)});
            });
            title.innerHTML = "";
            graph.innerHTML = "";
            drawWinLossDetail("FS-title", "FS-graph", history);
        });
        document.getElementById("win-loss-home-details").addEventListener("click", function(){
            fullscreen.classList.remove("close");
            fullscreen.classList.add("open");
            var histYears = years.slice(1);
            var history = [];
            histYears.forEach(function(e){
                //setCurrentData(e, currentTeam);
                history.push({year: e, win: homewinPercentage(e, currentTeam)});
            });
            title.innerHTML = "";
            graph.innerHTML = "";
            drawHomeWinLossDetail("FS-title", "FS-graph", history);
        });
        document.getElementById("win-loss-away-details").addEventListener("click", function(){
            fullscreen.classList.remove("close");
            fullscreen.classList.add("open");
            var histYears = years.slice(1);
            var history = [];
            histYears.forEach(function(e){
                //setCurrentData(e, currentTeam);
                history.push({year: e, win: awaywinPercentage(e, currentTeam)});
            });
            title.innerHTML = "";
            graph.innerHTML = "";
            drawAwayWinLossDetail("FS-title", "FS-graph", history);
        });

        var toggleBtn = document.getElementById("btn-toggle");
        toggleBtn.addEventListener("click", function(){
            if(page.classList.contains("toggled")){
                page.classList.remove("toggled");
            }else{
                page.classList.add("toggled");
            }
        })

    });
    });
    });
    });
    });
    });
