import backgammonIcon from "../assets/images/backgammon.png";
import nineleapsIcon from "../assets/images/nineleaps.png";
import amplyticIcon from "../assets/images/amplytic_logo.jpeg";
import {
    contact,
    css,
    express,
    git,
    github,
    html,
    javascript,
    linkedin,
    mongodb,
    mui,
    nextjs,
    nodejs,
    react,
    redux,
    rust,
    elixir,
    sass,
    tailwindcss,
    threads,
    snapgram,
    summiz,
    pricewise,
    typescript
} from "../assets/icons";

export const personalInfo = {
    name: "Aditya Bhadauria",
    location: "India",
    phone: "+91-6388342900",
    email: "adityabhadauria162002@gmail.com",
    title: "Full Stack Engineer",
    education: {
        degree: "B.E. in Computer Science",
        university: "Graphic Era University",
        location: "Dehradun, India",
        duration: "Aug 2019 – May 2023",
        gpa: "8.0/10"
    }
};

export const skills = [
    {
        imageUrl: react,
        name: "React",
        type: "Frontend",
    },
    {
        imageUrl: nodejs,
        name: "Node.js",
        type: "Backend",
    },
    {
        imageUrl: typescript,
        name: "TypeScript",
        type: "Frontend",
    },
    {
        imageUrl: javascript,
        name: "JavaScript",
        type: "Frontend",
    },
    {
        imageUrl: nextjs,
        name: "Next.js",
        type: "Frontend",
    },
    {
        imageUrl: mongodb,
        name: "MongoDB",
        type: "Database",
    },
    {
        imageUrl: redux,
        name: "Redux",
        type: "Frontend",
    },
    {
        imageUrl: git,
        name: "Git",
        type: "Version Control",
    },
    {
        imageUrl: github,
        name: "GitHub",
        type: "Version Control",
    },
    {
        imageUrl: tailwindcss,
        name: "Tailwind CSS",
        type: "Frontend",
    },
    {
        imageUrl: css,
        name: "CSS",
        type: "Frontend",
    },
    {
        imageUrl: html,
        name: "HTML",
        type: "Frontend",
    },
    {
        imageUrl: mui,
        name: "Material-UI",
        type: "Frontend",
    },
    {
        imageUrl: sass,
        name: "Sass",
        type: "Frontend",
    },
    {
        imageUrl: rust,
        name: "Rust",
        type: "Backend",
    },
    {
        imageUrl: elixir,
        name: "Elixir",
        type: "Backend",
    },
];

export const experiences = [
    {
        title: "Founding Backend Engineer",
        company_name: "Amplytic (Antler, 2025)",
        icon: amplyticIcon,
        iconBg: "#e8dff5",
        date: "Sept 2025 – Present",
        location: "Remote (London, United Kingdom)",
        points: [
            "Architected and deployed multi-country ETL Data pipelines on GCP Cloud Run, processing 500K+ daily data points.",
            "Developed an agentic workflow that transforms raw reports into verified searchable knowledge using multi-step reasoning.",
            "Built a hierarchical evaluation framework (NDCG) to benchmark RAG performance and improve search accuracy.",
            "Implemented a high-concurrency FastAPI backend with sub-100ms P99 latency.",
            "Built a Neo4j knowledge graph to represent complex energy regulations, defining clear relationship types to accurately connect rules, entities, and compliance requirements, enabling efficient regulatory queries and analysis.",
        ],
    },
    {
        title: "Founding Full Stack Engineer",
        company_name: "Backgammon Galaxy",
        icon: backgammonIcon,
        iconBg: "#a2d2ff",
        date: "Sept 2023 – Sept 2025",
        location: "Remote (Spain, Europe)",
        points: [
            "Deployed and optimized the platform using Kubernetes and Docker, ensuring smooth performance and 99.9% uptime.",
            "Revamped back-end infrastructure with asynchronous calls and optimized system architecture, reducing API response time from over 1 minute to under 15 seconds.",
            "Configured Kubernetes Horizontal Pod Autoscaler (HPA) to handle sudden traffic spikes during peak tournaments.",
            "Set up Prometheus and Grafana dashboards to track health and server load.",
            "Built a Game Analysis Engine with gRPC and RabbitMQ to detect mistakes in real time for improving gameplay.",
            "Integrated the XG Gammon engine to provide an AI opponent, allowing players to practice instantly.",
            "Developed AI-powered move suggestions using gnubg, helping players analyze matches and improve strategy.",
            "Architected a psychology-aware AI coaching system using RAG that explains why players make mistakes.",
            "Implemented real-time gameplay synchronization using WebSockets and Elixir, reducing move delay to under 200ms.",
            "Built social features with XMPP-based messaging allowing players to connect and challenge each other.",
            "Optimized mobile gameplay through React Native WebView integration across platforms.",
            "Built a subscription feature using RevenueCat for OMS and PayPal for payments.",
        ],
    },
    {
        title: "Software Developer",
        company_name: "Nineleaps",
        icon: nineleapsIcon,
        iconBg: "#accbe1",
        date: "Dec 2022 – Sept 2023",
        location: "Bangalore, India",
        points: [
            "Built a smart water management dashboard using React, Node.js, PostgreSQL, allowing city operators to track live water usage, detect leaks, and generate automated reports; reduced issue detection time by 20%.",
            "Designed and implemented custom D3.js charts to visualize real-time consumption patterns with interactive filtering.",
            "Developed automated alert and notification system that informed operators within minutes of abnormal usage patterns.",
            "Optimized CI/CD pipelines using GitHub Actions and Jenkins for seamless build, test, and deployment workflows.",
        ],
    },
];

export const socialLinks = [
    {
        name: 'Contact',
        iconUrl: contact,
        link: '/contact',
    },
    {
        name: 'GitHub',
        iconUrl: github,
        link: 'https://github.com/adityabhadauria',
    },
    {
        name: 'LinkedIn',
        iconUrl: linkedin,
        link: 'https://www.linkedin.com/in/aditya-bhadauria-016a771b9/',
    }
];

export const personalProjects = [
    {
        name: "Nodeflow",
        tagline: "Graph-powered code intelligence engine",
        description:
            "Index any codebase into a knowledge graph and query it with your terminal or AI agent. Nodeflow treats your codebase as a deeply interconnected graph of functions, classes, imports, calls, and types — enabling blast-radius analysis, dead-code detection, and full execution-flow tracing.",
        github: "https://github.com/aditya162002/nodeflow",
        technologies: ["Python", "KuzuDB", "tree-sitter", "MCP", "BM25", "Vector Search", "igraph"],
        highlights: [
            "Indexes 142-file codebases in ~4s — 623 symbols, 1,847 edges, 8 clusters.",
            "MCP server compatible with Claude Code & Cursor for real-time structural context.",
            "Hybrid BM25 + vector search over a KuzuDB embedded graph.",
            "Detects dead code, git-coupled files, and full execution flows.",
        ],
        accentColor: "#6366f1", // indigo
    },
];

export const projects = [
    {
        iconUrl: threads,
        theme: 'btn-back-green',
        name: 'Backgammon Galaxy v2',
        description: 'A leading backgammon platform in Europe with 40,000+ daily active users. Real-time multiplayer with AI opponents, game analysis engine, social features, and subscription system.',
        link: 'https://play.backgammongalaxy.com',
        technologies: ['React', 'Elixir', 'WebSockets', 'Kubernetes', 'Docker', 'gRPC', 'RabbitMQ', 'XMPP'],
    },
    {
        iconUrl: null,
        theme: 'btn-back-blue',
        name: 'Amplytic — Energy Intelligence',
        description: 'Multi-country ETL pipelines processing 500K+ daily data points. Agentic RAG workflows, Neo4j knowledge graphs for energy regulations, and a high-concurrency FastAPI backend with sub-100ms P99 latency.',
        link: '#',
        technologies: ['Python', 'FastAPI', 'GCP', 'Neo4j', 'RAG', 'LLM'],
        customIcon: 'A',
    },
    {
        iconUrl: pricewise,
        theme: 'btn-back-orange',
        name: 'NLP Chatbot',
        description: 'Built an NLP-powered chatbot using HuggingFace Transformers for intent detection, handling FAQs with 95% accuracy. Integrated with FastAPI and MongoDB for personalized responses.',
        link: '#',
        technologies: ['Python', 'HuggingFace', 'FastAPI', 'MongoDB', 'NLP'],
    },
    {
        iconUrl: snapgram,
        theme: 'btn-back-pink',
        name: 'Smart Water Management',
        description: 'Real-time dashboard for city operators to track water usage, detect leaks, and generate automated reports with custom D3.js visualizations. Reduced issue detection time by 20%.',
        link: '#',
        technologies: ['React', 'Node.js', 'PostgreSQL', 'D3.js', 'Jenkins'],
    },
    {
        iconUrl: summiz,
        theme: 'btn-back-yellow',
        name: 'AI Game Coaching System',
        description: 'Psychology-aware AI coaching system using RAG that explains why players make mistakes. Integrated XG Gammon and gnubg engines for move analysis and blunder explanations via LLMs.',
        link: '#',
        technologies: ['RAG', 'Anthropic LLM', 'gRPC', 'Game AI', 'Python'],
    },
];
