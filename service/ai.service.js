import { generateText } from "../utils/gemini.js";

export const impoveWithAi = async(req,res) => {
    try{
        const{ section, context } = req.body;

        let prompt = "";

        if (section === "project") {
            prompt = `
                You are a professional resume writer optimizing content for ATS systems.
                Rewrite the following project description into 2-3 bullet points that:
                - Start with strong action verbs
                - Include measurable results or impact (if applicable)
                - Highlight relevant skills and technologies
                - Use clear, ATS-friendly language without jargon
                - Output PLAIN TEXT ONLY - no markdown, no asterisks, no bold formatting
            
                Job Role (target): ${context.jobDescription || "Not provided"}
                Skills: ${context.skills?.join(", ") || "Not provided"}
                Project: ${context.name}
                Original description: ${context.description || "Not Provided"}
            
                Provide ONLY the improved bullet points in plain text format, nothing else.
            `;
          }          

        
        if (section === "experience") {
            prompt = `
                You are a professional resume writer optimizing work experiences for ATS.
                Rewrite the following job experience into 2-3 bullet points that:
                - Start with strong action verbs
                - Quantify achievements with numbers/metrics where possible
                - Highlight leadership, problem-solving, and impact
                - Match skills to the target job description
                - Output PLAIN TEXT ONLY - no markdown, no asterisks, no bold formatting
                - Keep ATS-friendly formatting with plain text bullets
                
                Job Title: ${context.title}
                Company: ${context.company}
                Skills: ${context.skills?.join(", ") || "Not provided"}
                Original description: ${context.description || "Not provided"}
                
                Provide ONLY the improved bullet points in plain text format, nothing else.
            `;
        }
          


        if (section === "summary") {
            prompt = `
                You are a professional resume writer optimizing resume summaries for ATS.
                Write a 3–4 sentence summary that:
                - Highlights relevant skills and experience
                - Mentions years of experience (if provided)
                - Includes industry-specific keywords from the job description
                - Stays concise and ATS-friendly (no fancy symbols, no personal pronouns)
                - Output PLAIN TEXT ONLY - no markdown, no asterisks, no bold formatting
            
                Skills: ${context.skills?.join(", ") || "Not provided"}
                Experience: ${context.experience || "Not provided"}
                Projects: ${context.projects?.map(p => p.name + " - " + p.description).join("; ") || "Not provided"}
                Current summary: ${context.summary || ""}
            
                Provide ONLY the improved summary in plain text format, nothing else.
            `;
          }
          
            
        
        const aiResponse = await generateText(prompt);
        res.json({improveWithAi: aiResponse});
      
    }catch(error){
        console.error('AI service error:', error);
        res.status(500).json({message: "Failed to improve content with AI. Please try again."});
    }
}