import backgammonIcon from "../assets/images/backgammon.png";
import nineleapsIcon from "../assets/images/nineleaps.png";
import amplyticIcon from "../assets/images/amplytic_logo.jpeg";
import {
    contact,
    git,
    github,
    javascript,
    linkedin,
    mongodb,
    mui,
    nextjs,
    nodejs,
    react,
    rust,
    typescript,
    threads,
    snapgram,
    summiz,
} from "../assets/icons";

export const personalInfo = {
    name: "Aditya Bhadauria",
    location: "India",
    phone: "+91-6388342900",
    email: "adityabhadauria162002@gmail.com",
    title: "Senior Software Engineer",
    tagline: "Full-stack, computer vision & AI systems",
    education: {
        degree: "B.E. in Computer Science",
        university: "Graphic Era University",
        location: "Dehradun, India",
        duration: "Aug 2019 – May 2023",
        gpa: "8.0/10",
    },
};

export const skills = [
    { imageUrl: react, name: "React", type: "Frontend" },
    { imageUrl: nextjs, name: "Next.js", type: "Frontend" },
    { imageUrl: typescript, name: "TypeScript", type: "Frontend" },
    { imageUrl: javascript, name: "JavaScript", type: "Frontend" },
    { imageUrl: nodejs, name: "Node.js", type: "Backend" },
    { imageUrl: mui, name: "Material UI", type: "Frontend" },
    { imageUrl: mongodb, name: "MongoDB", type: "Database" },
    { imageUrl: rust, name: "Rust", type: "Backend" },
    { imageUrl: git, name: "Git", type: "Version Control" },
    { imageUrl: github, name: "GitHub", type: "Version Control" },
];

export const skillCategories = [
    {
        label: "Languages",
        items: ["Python", "TypeScript", "JavaScript", "C/C++", "Java", "Rust", "SQL"],
    },
    {
        label: "Frameworks",
        items: ["React.js", "Next.js", "Node.js", "FastAPI", "Material UI"],
    },
    {
        label: "ML & Vision",
        items: ["PyTorch", "RF-DETR", "YOLO", "Transformers", "OpenCV", "RAG"],
    },
    {
        label: "Databases",
        items: ["PostgreSQL", "MySQL", "MongoDB", "Neo4j", "Prisma"],
    },
    {
        label: "DevOps",
        items: ["Kubernetes", "Docker", "Helm", "AWS", "GCP", "CI/CD", "Prometheus", "Grafana"],
    },
    {
        label: "Tools",
        items: ["Git", "RabbitMQ", "gRPC", "Linux", "Sentry", "pytest"],
    },
];

export const experiences = [
    {
        title: "Senior Software Engineer",
        company_name: "Backgammon Galaxy",
        icon: backgammonIcon,
        iconBg: "#1e3a5f",
        date: "Sept 2023 – Present",
        location: "Remote (Spain, Europe)",
        sections: [
            {
                title: "Computer Vision Match Transcription",
                points: [
                    "Built an end-to-end video-to-transcript pipeline turning match recordings into analysis-ready games.",
                    "Fine-tuned RF-DETR to detect the board, checkers, dice and cube, and YOLO to read dice values.",
                    "Swapped per-frame dice inference for a temporal transformer over frame windows, handling blur and occlusion.",
                    "Architected a hybrid GPU/CPU pipeline processing 1,000+ matches daily at 65% lower GPU cost.",
                    "Added cross-frame trajectory tracking and automated move validation for consistent transcripts.",
                ],
            },
            {
                title: "Backend Architecture",
                points: [
                    "Deployed and optimized the platform using Kubernetes and Docker, ensuring smooth performance and 99.9% uptime.",
                    "Revamped back-end infrastructure with asynchronous calls, reducing API response time from over 1 minute to under 15 seconds.",
                    "Configured Kubernetes Horizontal Pod Autoscaler (HPA) to handle sudden traffic spikes during peak tournaments.",
                    "Set up Prometheus and Grafana dashboards to track application health and server load.",
                    "Built a Game Analysis Engine with gRPC and RabbitMQ to detect mistakes in real time.",
                ],
            },
            {
                title: "AI-Powered Game Features",
                points: [
                    "Integrated the XG Gammon engine to provide an AI opponent for instant practice.",
                    "Developed AI-powered move suggestions using gnubg for match analysis and strategy improvement.",
                    "Architected a psychology-aware AI coaching system using RAG that explains why players make mistakes.",
                ],
            },
        ],
    },
    {
        title: "Software Consultant",
        company_name: "Amplytic (Antler, 2025)",
        icon: amplyticIcon,
        iconBg: "#2d1f3d",
        date: "Nov 2025 – Feb 2026",
        location: "Remote (London, United Kingdom)",
        points: [
            "Built an AI agent for asset managers to automate workflows and improve investment returns.",
            "Architected and deployed multi-country ETL data pipelines on GCP Cloud Run, processing 500K+ daily data points.",
            "Developed an agentic workflow that transforms raw reports into verified searchable knowledge using multi-step reasoning.",
            "Built a hierarchical evaluation framework (NDCG) to benchmark RAG performance and improve search accuracy.",
            "Implemented a high-concurrency FastAPI backend with sub-100ms P99 latency.",
            "Built a Neo4j knowledge graph for complex energy regulations, connecting rules, entities, and compliance requirements.",
        ],
    },
    {
        title: "Software Developer",
        company_name: "Nineleaps",
        icon: nineleapsIcon,
        iconBg: "#1a3344",
        date: "Dec 2022 – Sept 2023",
        location: "Bangalore, India",
        points: [
            "Built a smart water management dashboard using React, Node.js, and PostgreSQL for live usage tracking, leak detection, and automated reports — reducing issue detection time by 20%.",
            "Designed and implemented custom D3.js charts to visualize real-time consumption patterns with interactive filtering.",
            "Developed an automated alert system that informed operators within minutes of abnormal usage patterns.",
            "Optimized CI/CD pipelines using GitHub Actions and Jenkins for seamless build, test, and deployment workflows.",
            "Developed and maintained backend APIs and frontend components for real-time data visualization and reporting.",
        ],
    },
];

export const socialLinks = [
    {
        name: "Contact",
        iconUrl: contact,
        link: "/contact",
    },
    {
        name: "GitHub",
        iconUrl: github,
        link: "https://github.com/adityabhadauria",
    },
    {
        name: "LinkedIn",
        iconUrl: linkedin,
        link: "https://www.linkedin.com/in/aditya-bhadauria-016a771b9/",
    },
];

export const personalProjects = [
    {
        name: "Nodeflow",
        tagline: "Graph-powered code intelligence engine",
        description:
            "Indexes any codebase into a knowledge graph and query it with your terminal or AI agent. Treats code as an interconnected graph of functions, classes, imports, calls, and types — enabling blast-radius analysis, dead-code detection, and execution-flow tracing.",
        github: "https://github.com/aditya162002/nodeflow",
        technologies: ["Python", "KuzuDB", "tree-sitter", "MCP", "BM25", "Vector Search"],
        highlights: [
            "Indexes 142-file codebases in ~4s — 623 symbols, 1,847 edges, 8 clusters.",
            "MCP server compatible with Claude Code & Cursor for real-time structural context.",
            "Hybrid BM25 + vector search over a KuzuDB embedded graph.",
            "Detects dead code, git-coupled files, and full execution flows.",
        ],
        accentColor: "#38bdf8",
    },
    {
        name: "AI Fashion Platform",
        tagline: "Personalized outfit curation with recommendation systems",
        description:
            "AI-powered fashion platform that curates personalized outfits using recommendation systems tailored to user style and preferences.",
        github: null,
        link: null,
        technologies: ["Python", "Recommendation Systems", "ML"],
        highlights: [
            "Personalized outfit recommendations driven by user preference signals.",
            "End-to-end curation flow from preference input to styled looks.",
        ],
        accentColor: "#34d399",
    },
];

export const openSource = [
    {
        name: "Onlook",
        detail: "YC S25 — contributions to the open-source visual editor for designers & developers.",
        link: "https://github.com/onlook-dev/onlook",
    },
    {
        name: "Datacurve.ai",
        detail: "Built evaluation benchmarks for AI agents.",
        link: "https://datacurve.ai",
    },
];

export const projects = [
    {
        iconUrl: threads,
        theme: "btn-back-green",
        name: "Backgammon Galaxy",
        description:
            "Leading European backgammon platform. Built computer-vision match transcription (RF-DETR + YOLO + temporal transformers), Kubernetes backend at 99.9% uptime, and AI coaching with RAG — processing 1,000+ matches daily.",
        link: "https://play.backgammongalaxy.com",
        technologies: ["PyTorch", "RF-DETR", "YOLO", "Kubernetes", "gRPC", "RabbitMQ", "RAG"],
    },
    {
        iconUrl: null,
        theme: "btn-back-blue",
        name: "Amplytic — Energy Intelligence",
        description:
            "AI agent for asset managers, multi-country ETL on GCP Cloud Run (500K+ daily points), Neo4j regulatory knowledge graphs, and FastAPI with sub-100ms P99 latency.",
        link: "#",
        technologies: ["Python", "FastAPI", "GCP", "Neo4j", "RAG", "LLM"],
        customIcon: "A",
    },
    {
        iconUrl: null,
        theme: "btn-back-yellow",
        name: "Nodeflow",
        description:
            "Graph-powered code intelligence engine that indexes any codebase into a knowledge graph for structural search, blast-radius analysis, and MCP-native AI context.",
        link: "https://github.com/aditya162002/nodeflow",
        technologies: ["Python", "KuzuDB", "tree-sitter", "MCP", "Vector Search"],
        customIcon: "N",
    },
    {
        iconUrl: snapgram,
        theme: "btn-back-pink",
        name: "Smart Water Management",
        description:
            "Real-time dashboard for city operators to track water usage, detect leaks, and generate automated reports with custom D3.js visualizations. Reduced issue detection time by 20%.",
        link: "#",
        technologies: ["React", "Node.js", "PostgreSQL", "D3.js", "Jenkins"],
    },
    {
        iconUrl: summiz,
        theme: "btn-back-orange",
        name: "AI Game Coaching System",
        description:
            "Psychology-aware AI coaching using RAG that explains why players make mistakes. Integrated XG Gammon and gnubg for move analysis and blunder explanations.",
        link: "#",
        technologies: ["RAG", "LLM", "gRPC", "Game AI", "Python"],
    },
];
