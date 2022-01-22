const app = angular.module("myApp", []);
const baseUrl = "http://127.0.0.1:8000"

//რეგისტრაცია
app.controller("register", function ($scope, $http) {
    $scope.isError = false

    $scope.registerUser = function () {

        let sendData = {
            "email": $scope.email,
            "password": $scope.password,
            "confirmPassword": $scope.confirmPassword,
            "name": $scope.name
        }
        if (sendData.email !== undefined && sendData.name !== undefined && sendData.password !== undefined && sendData.confirmPassword !== undefined) {
            if (sendData.password !== sendData.confirmPassword) {
                alert("პაროლები უნდა ემთხვეოდეს ერთმანეთს")
                return;
            }
            $http.post(baseUrl + "/api/user/create/", sendData).then(function (res) {
                console.log(res)
                alert("მომხმარებელი წარმატებით დარეგისტრირდა")
                // $scope.user = res.data
            }).catch(function (res) {

                $scope.isError = true;
            })
        }

    }

})


//ავტორიზაცია
app.controller("login", function ($scope, $http, $window) {
    const token = $window.localStorage.getItem('token');
    if (token) {
        $window.localStorage.removeItem('token')
    }
    $scope.getToken = function () {

        $scope.isError = false
        let sendData = {
            "email": $scope.email,
            "password": $scope.password
        }
        $http.post(baseUrl + "/api/user/token/", sendData).then(function (res) {
            $window.localStorage.setItem('token', res.data.token);
            $window.location.href = "http://127.0.0.1:8000/recipes/";
        }).catch(function (res) {
            $scope.isError = true
        })
    }

})

//main
app.controller("main", function ($scope, $http, $window) {
    //TODO რეცეპტების გვერდი,ჰედერი სამი მენიუს აითემით, tags,ingredients,recipes
    const token = $window.localStorage.getItem('token');

    if (token === undefined || token === null || token === "") {

        $window.location.href = "http://127.0.0.1:8000/";
    } else {
        $http.defaults.headers.common.Authorization = 'Token ' + token;
        $scope.getUserInfo = function () {

            $http.get(baseUrl + '/api/user/me').then(function (res) {
                $scope.user = res.data.name;
            })
        }
        $scope.getUserInfo();
        $scope.getIngredients = function () {
            $http.get(baseUrl + '/api/recipe/ingredients/').then(function (res) {
                $scope.ingredients = res.data
            });
        }


        $scope.getRecipes = function () {
            $scope.testUrl = 'https://github.com/AnaChikashua/recipe-app-api/tree/main/app';
            $http.get(baseUrl + '/api/recipe/recipes/').then(function (res) {

                let data = res.data;
                $scope.recipes = [];
                data.forEach(f => {
                    let d = {
                        "id": f.id,
                        "title": f.title,
                        "ingredients": $scope.ingredients.filter(t => f.ingredients.includes(t.id)),
                        "tags": $scope.tags.filter(t => f.tags.includes(t.id)),
                        "time_minutes": f.time_minutes,
                        "price": f.price,
                        "link": f.link
                    }

                    $scope.recipes.push(d)
                })

            });
        }

        $scope.getTagList = function () {
            $http.get(baseUrl + '/api/recipe/tags/').then(function (res) {
                $scope.tags = res.data;
            });
        }

        $scope.getIngredients();
        $scope.getTagList();
        $scope.getRecipes();

        $scope.addIngredient = function () {

            $http.post(baseUrl + '/api/recipe/ingredients/', {"name": $scope.ingredientName}).then(function (res) {
                $scope.ingredientName = null
                $scope.getIngredients()
            }).catch(function (res) {
                console.log(res)
            })
        }
        $scope.selectedIngredients = []
        $scope.selectedTag = []
        $scope.changeIngr = function () {
            $scope.selectedIngredients = []
            $scope.ingRec.forEach(f => {
                $scope.selectedIngredients.push(f.name)
            });
            $scope.ingredientsSelected = $scope.selectedIngredients.join(" ; ")
        }
        $scope.changeTag = function () {
            $scope.selectedIngredients = []
            $scope.tagRecipe.forEach(f => {
                $scope.selectedTag.push(f.name)
            });
            $scope.tagsSelected = $scope.selectedTag.join(" ; ")
        }
        $scope.addRecipe = function () {
            let ingr = []
            let t = []
            $scope.ingRec.forEach(f => {
                ingr.push(f.id)
            })
            $scope.tagRecipe.forEach(f => {
                t.push(f.id)
            })


            const sendData = {
                "title": $scope.title,
                "ingredients": ingr,
                "tags": t,
                "time_minutes": $scope.time,
                "price": $scope.price.toString(),
                "link": $scope.link,
            };
            $http.post(baseUrl + '/api/recipe/recipes/', sendData).then(function (res) {
                $scope.getRecipes()
            }).catch(function (res) {
                console.log(res)
            })
        }

        $scope.addTag = function () {
            $http.post(baseUrl + '/api/recipe/tags/', {"name": $scope.tagName}).then(function (res) {
                $scope.tagName = null
                $scope.getTagList()
            }).catch(function (res) {
                console.log(res)
            })
        }
        $scope.redirectSite = function (link) {
            $window.location.href = link;

        }

    }

})

