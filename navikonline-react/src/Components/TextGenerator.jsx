

// Enable only for client side implementayion of hugging face inference api


// import React, { useState, useEffect, useRef } from 'react';
// import { InferenceClient } from "@huggingface/inference";
// import { Button, Input, Card, Spin, message, Typography, Avatar } from 'antd';
// import { SendOutlined, UserOutlined, RobotFilled } from '@ant-design/icons';
// import ReactMarkdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// const { TextArea } = Input;
// const { Title, Text } = Typography;

// // Remove <think>...</think> blocks and their content, and normalize whitespace for markdown
// function stripThinkTags(text) {
//   // Remove <think>...</think> blocks
//   let cleaned = text.replace(/<think>[\s\S]*?<\/think>/gi, '');

//   // Split into lines for line-by-line processing
//   let lines = cleaned.split('\n');

//   // Remove trailing spaces and filter lines
//   lines = lines.map(line => line.trimEnd());
//   lines = lines.filter((line, idx, arr) => {
//     // Keep if line is not empty, or if it's a markdown bullet/numbered list or table row
//     if (
//       line.trim() === '' &&
//       idx > 0 &&
//       (
//         arr[idx - 1].trim().match(/^[-*+]\s|^\d+\.\s/) || // bullet/numbered list
//         arr[idx - 1].trim().startsWith('|') // markdown table row
//       )
//     ) {
//       // Keep a blank line after a bullet/numbered list or table for markdown
//       return true;
//     }
//     return line.trim() !== '';
//   });

//   // Rejoin, ensuring single blank lines between paragraphs/lists/tables
//   cleaned = lines.join('\n');

//   // Collapse multiple blank lines to a single blank line
//   cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

//   // Remove leading/trailing whitespace
//   return cleaned.trim();
// }

// const TextGenerator = () => {
//   const [prompt, setPrompt] = useState('');
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [apiKey, setApiKey] = useState('');
//   const chatRef = useRef(null);

//   useEffect(() => {
//     // Check if API key is available
//     const key = process.env.REACT_APP_HUGGINGFACE_API_KEY;
//     if (!key) {
//       message.error('API key not found. Please check your environment variables.');
//       return;
//     }
//     setApiKey(key);
//   }, []);

//   useEffect(() => {
//     // Scroll to bottom on new message
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages, loading]);

//   const generateResponse = async () => {
//     if (!prompt.trim()) {
//       message.warning('Please enter a message first!');
//       return;
//     }

//     if (!apiKey) {
//       message.error('API key not configured. Please check your environment variables.');
//       return;
//     }

//     setLoading(true);
//     try {
//       // Add user message to chat
//       const userMessage = {
//         role: 'user',
//         content: prompt,
//         timestamp: new Date().toLocaleTimeString()
//       };
//       setMessages(prev => [...prev, userMessage]);

//       // Initialize the client
//       const client = new InferenceClient(apiKey);

//       // Get AI response
//       const chatCompletion = await client.chatCompletion({
//         provider: "together",
//         model: "deepseek-ai/DeepSeek-R1",
//         messages: [
//           ...messages.map(msg => ({
//             role: msg.role,
//             content: msg.content
//           })),
//           {
//             role: "user",
//             content: prompt,
//           },
//         ],
//         top_p: 1,
//       });

//       // Remove <think>...</think> blocks from assistant response
//       const aiContent = stripThinkTags(chatCompletion.choices[0].message.content);
//       // Add AI response to chat
//       const aiMessage = {
//         role: 'assistant',
//         content: aiContent,
//         timestamp: new Date().toLocaleTimeString()
//       };
//       setMessages(prev => [...prev, aiMessage]);
//       setPrompt('');
//       message.success('Response generated successfully!');
//     } catch (error) {
//       console.error('Detailed error:', error);
//       message.error(`Error: ${error.message || 'Failed to generate response. Please try again.'}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       generateResponse();
//     }
//   };

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <Card className="shadow-lg">
//         <Title level={2} className="text-center mb-6">AI Chat Assistant</Title>
        
//         {/* Chat Messages */}
//         <div ref={chatRef} className="h-[500px] overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
//           {messages.map((message, index) => (
//             <div
//               key={index}
//               className={`flex items-start mb-4 ${
//                 message.role === 'user' ? 'justify-end' : 'justify-start'
//               }`}
//             >
//               <div
//                 className={`flex items-start max-w-[80%] gap-3 ${
//                   message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
//                 }`}
//               >
//                 <Avatar
//                   icon={message.role === 'user' ? <UserOutlined /> : <RobotFilled style={{ fontSize: 22 }} />}
//                   className={
//                     message.role === 'user' ? 'bg-blue-500 ml-2' : 'bg-green-500 mr-2'
//                   }
//                   size={40}
//                   style={{ minWidth: 40, minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
//                 />
//                 <div
//                   className={`p-3 rounded-lg ${
//                     message.role === 'user'
//                       ? 'bg-blue-100 text-blue-900'
//                       : 'bg-green-100 text-green-900'
//                   }`}
//                   style={{ whiteSpace: message.role === 'assistant' ? 'pre-wrap' : 'normal', fontFamily: message.role === 'assistant' ? 'inherit' : 'inherit' }}
//                 >
//                   {message.role === 'user' ? (
//                     <Text>{message.content}</Text>
//                   ) : (
//                     <ReactMarkdown
//                       remarkPlugins={[remarkGfm]}
//                       components={{
//                         code({ node, inline, className, children, ...props }) {
//                           const match = /language-(\w+)/.exec(className || '');
//                           return !inline ? (
//                             <SyntaxHighlighter
//                               style={oneDark}
//                               language={match ? match[1] : 'plaintext'}
//                               PreTag="div"
//                               {...props}
//                             >
//                               {String(children).replace(/\n$/, '')}
//                             </SyntaxHighlighter>
//                           ) : (
//                             <code className={className} {...props}>
//                               {children}
//                             </code>
//                           );
//                         }
//                       }}
//                     >
//                       {message.content}
//                     </ReactMarkdown>
//                   )}
//                   <div className="text-xs text-gray-500 mt-1">{message.timestamp}</div>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {loading && (
//             <div className="flex justify-center items-center">
//               <Spin tip="Generating response..." />
//             </div>
//           )}
//         </div>

//         {/* Input Area */}
//         <div className="flex gap-2">
//           <TextArea
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             onKeyPress={handleKeyPress}
//             placeholder="Type your message here..."
//             autoSize={{ minRows: 2, maxRows: 4 }}
//             className="flex-1"
//           />
//           <Button
//             type="primary"
//             icon={<SendOutlined />}
//             onClick={generateResponse}
//             loading={loading}
//             className="h-auto"
//           >
//             Send
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default TextGenerator;