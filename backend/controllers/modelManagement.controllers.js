const bestGeminiModels = [
    {
      id: 'gemini-2.5-pro',
      name: 'Gemini 2.5 Pro', 
      inputCost: 1.25,  
      outputCost: 10,
      inputCostHigh: 2.5,
      outputCostHigh: 15
    },
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      inputCost: 0.30,
      outputCost: 0.30
    }
  ];
  
let activeModelId = 'gpt-3.5-turbo';
const listModels = async(req, res) => {
    try {
        const { model } = req.body;
        if(!['gemini-2.5-pro', 'gemini-2.5-flash'].includes(model)) {
            return res.status(400).json({error: "Invalid model"});
        }
        const modelId = `uuid-${model}`;
        activeModelId = modelId;
        
        res.status(202).json({
            models: modelSpecs,
            activeModel: activeModelId
        });
    } catch (error) {
        console.error("Models listing error", error);
        res.status(500).json({
            error: "Failed to fetch models"
      });
    }
}

const switchModel = async(req, res) => {
    try {
        const { model } = req.body;
        const user = req.user;

        if(!modelSpecs.some(m => m.id === model._id )) {
            return res.status(400).json({
                error: "Invalid model specs"
          });
        }

        if(model === 'gemini-2.5-pro' && user?.tier !== 'premium') {
            return res.status(403).json({
                error: "Gemini pro requires premium tier"
          });
         }
        const modelId = `uuid-${model}`;
        activeModelId = modelId;
        console.log(`User ${user.id} switched to ${modelId}`);

        res.status(200).json({
            success: true,
            activeModel: activeModelId
        });
    } catch (error) {
        console.error("Model switching error", error);
        res.status(500).json({
            error: "Failed to switch model"
      });
    }
}

export { listModels, switchModel };