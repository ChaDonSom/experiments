import type { RouteRecordRaw } from "vue-router";
const GameVue = () => import("@/experiments/phaser-tutorial/Game.vue")
const StartVue = () => import("@/experiments/phaser-tutorial/Start.vue")
const PhaserTutorial = () => import("@/experiments/phaser-tutorial/PhaserTutorial.vue")
const Checkers = () => import("@/experiments/checkers/Checkers.vue")

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
        children: [
            
        ]
    }
];

export default routes;
