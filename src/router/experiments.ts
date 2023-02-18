import type { RouteRecordRaw } from "vue-router";
const GameVue = () => import("@/experiments/phaser-tutorial/Game.vue")
const StartVue = () => import("@/experiments/phaser-tutorial/Start.vue")
const PhaserTutorial = () => import("@/experiments/phaser-tutorial/PhaserTutorial.vue")
const Checkers = () => import("@/experiments/checkers/Checkers.vue")
const Memory = () => import("@/experiments/memory/Memory.vue")
const PetFarm = () => import("@/experiments/pet-farm/PetFarm.vue")
const Boids = () => import("@/experiments/boids/Boids.vue")

const routes: RouteRecordRaw[] = [
    {
        name: "phaser-tutorial", path: "/phaser-tutorial", component: PhaserTutorial, props: true,
        children: [
            {
                name: "phaser-tutorial-game", path: "game", component: GameVue
            },
            {
                name: "phaser-tutorial-start", path: "start", component: StartVue
            }
        ]
    },
    {
        name: "checkers", path: "/checkers", component: Checkers, props: true,
        children: [ ]
    },
    {
        name: "memory", path: "/memory", component: Memory, props: true,
        children: [ ]
    },
    {
        name: "pet-farm", path: "/pet-farm", component: PetFarm, props: true,
        children: [ ]
    },
    {
        name: "boids", path: "/boids", component: Boids, props: true,
        children: []
    },
];

export default routes;
