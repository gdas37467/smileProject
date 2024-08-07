import React, { useState } from 'react'
import { ChakraProvider, IconButton, FormHelperText, Heading, Button, FormControl, FormLabel, Input, Icon, InputGroup, InputLeftAddon, PinInput, PinInputField, HStack, VStack,  Box} from '@chakra-ui/react'
import { Envelope } from '@phosphor-icons/react'
import axios from 'axios'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {AnimatePresence, motion} from 'framer-motion'
import getCookie from '../getToken'


// Email Regex
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export default function LoginPage(props){
    axios.defaults.withCredentials=true

    const navigate = useNavigate()

    
        //Recepient Email
        const [email , setEmail] = useState('')
        //Error Msg for Phone Number
        const [errMsg , setErrorMsg] = useState({
            isErr : false,
            msg : ''
        })    
        
        // Getting OTP value from user input
        const [otpVal ,setOtpVal] = useState("")
        //Verifying OTP
        const [isLoading , setIsLoading] = useState(false)
        //Checking Email Validity
        const [isEmailValid , setIsEmailValid] = useState(false)
        // Email Check
        const [check , setCheck] = useState(false)
        
        //Handlers
       
    
        // SEND OTP and Next Page
        const sendOtp = async(email) =>{

            if(!emailRegex.test(email)){
                setErrorMsg({
                    isErr : true,
                    msg : "Invalid Email! Please Enter a valid Email."
                })
                return
            }else{
                setCheck(true)
                setErrorMsg({
                    isErr : false,
                    msg : ""
                })
                let url = ''
                try {
                    switch(props.type){
                        case 'recipientLogin':
                            url = 'donor/send_otp/'
                            break
                        
                        case 'donorLogin' :
                            url = 'donor/donor_send_otp/'
                            break
                        
                        default:
                            Swal.fire({
                                text: 'Invalid URL! Please Try Again.', 
                                icon : 'error'
                            })
                            break
                    }
                    await axios.post(`/api/v1/${url}`, JSON.stringify({email : email}))
                    toast.success("OTP Sent Successfully !",{
                        position : toast.POSITION.TOP_RIGHT
                    })
                } catch (err) {
                    setCheck(false)
                    toast.error(err.response.data.error || 'Something Went Wrong',{
                        position : toast.POSITION.TOP_RIGHT
                    })                
                }

                
    
            }
        }
    
        // Verify OTP
        const verifyOtp = async ( ) =>{
            
            if(otpVal.length !== 6){
                toast.error("Please Put a Valid OTP", {
                    position : toast.POSITION.TOP_CENTER
                })
                return
            }else{
                setIsLoading(true)
                try {
                    var token = getCookie('csrftoken')
                    const res = await axios.post('/api/v1/donor/verify_otp/',JSON.stringify({otp : otpVal}),{
                        headers : {'X-CSRFToken': token}
                    })
                    if( 'success' in res.data){
                        const now = new Date().getTime()
                        let check = {
                            user : res.data.user_type,
                            expire : now + 44*60*1000
                        }
                        localStorage.setItem('check',JSON.stringify(check))
                        Swal.fire({
                            title : 'OTP Successfully verified',
                            icon : 'success'
                        }).then((res) =>{
                            if(res.isConfirmed || res.dismiss==='backdrop'){
                                switch(props.type){
                                case 'recipientLogin' :
                                    navigate('/request/requestdashboard')
                                    break

                                case 'donorLogin':
                                    navigate('/donate/donordashboard')
                                    break
                                
                                default :
                                    Swal.fire({
                                        text : 'Something Went Wrong',
                                        icon : 'error'
                                    })
                                }
                            }
                        })
                        setIsLoading(false)
                    }else{
                        Swal.fire({
                            text : res.data.error,
                            icon : 'error'
                        })
                    }
                } catch (error) {
                    Swal.fire({
                        title : error.response.data.error || 'Something went wrong!' , 
                        icon  : 'error'
                    })                
                    setIsLoading(false)
                }
    
            }
        }
        //Real Time Number check
        const emailCheck =(email) =>{
            if(!emailRegex.test(email)){
                setIsEmailValid(true)
                setEmail(email)
            }else{
                setIsEmailValid(false)
                setEmail(email)
            }
        }

    return(
        <>
            <ChakraProvider>
                <VStack>
                    <Heading as='h3' > {props.type === 'recipientLogin' ? "Recipient Login" : "Donor Login"} </Heading>
                        <FormControl mt={15} isRequired  width={{base : '28rem', lg : '35rem'}}>
                            <FormLabel fontSize='1.4rem' htmlFor='email'>Email</FormLabel>
                            <InputGroup>
                                <InputLeftAddon backgroundColor='#d71414' height={30}>
                                    <Icon as={Envelope} boxSize={8} weight='duotone' color='#f0e3e4' />
                                </InputLeftAddon>
                                <Input  variant='outline'
                                        backgroundColor={check ? 'gray.300' :'blue.50'}
                                        isInvalid={isEmailValid}
                                        focusBorderColor={isEmailValid ? 'red.400' : 'green.300'}
                                        errorBorderColor='red.400'
                                        height={30} 
                                        fontSize={14}  
                                        type="email" 
                                        name="email" 
                                        value={email} 
                                        required
                                        readOnly={check}
                                        onChange={e =>  emailCheck(e.target.value)} 
                                />
                            </InputGroup>
                            {errMsg.isErr ? (
                                    <FormHelperText fontSize={12} color="red" fontWeight={500} >{errMsg.msg}</FormHelperText>
                                ) : null}                                        
                        </FormControl>
                        {
                            !check ? (
                                <IconButton
                                    isRound={true}
                                    onClick={e => sendOtp(email)}
                                    sx={{ ml: 'auto',mr :{ xs : 0, md : 24}}}
                                    className='reg_btn'
                                    color="black" bg="#d7141450" 
                                    _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                    mt={10}
                                    fontSize='16px'
                                    height='3rem'
                                    width='3rem'
                                    
                                    icon={<ArrowForwardIosIcon />}
                                />               
                            ) : (
                                
                                <AnimatePresence>
                                    <motion.div
                                        initial={{x : '20vw', opacity : 0}}
                                        animate={{x : 0, opacity : 1}}
                                        transition={{ duration : 0.2, type : 'easeOut' }}
                                        type='easeInOut'

                                    >
                                                <VStack>

                                                    <HStack mt={2} mb={1}>
                                                        <Button size='small' 
                                                                color="black" 
                                                                _hover={{color:'black' , bg: '#daccca', fontWeight:'400' }} 
                                                                bg='#daccca'
                                                                textDecoration='underline'
                                                                fontSize='10px'
                                                                fontWeight='200'
                                                                onClick={() => setCheck(false)}
                                                        >
                                                            Wrong Email? Update Here!
                                                        </Button>
                                                        
                                                    </HStack>
                                                        <Box sx={{color:'#d71414', fontSize : '10px', fontWeight: 200 }}>
                                                            (Please verify your email by checking your inbox or spam folder for the OTP.)
                                                        </Box>
                                                    <HStack>
                                                        <PinInput otp variant='pill' size='lg' value={otpVal}  onChange={e=>setOtpVal(e)}
                                                                    placeholder='_'
                                                        >
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                            <PinInputField height={20} fontSize={22}  color='black' bg='#d7141450'/>
                                                        </PinInput>
                                                    </HStack>
                                                    <Button 
                                                        color="black" bg="#d7141450" 
                                                        _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                                        className='reg_btn'
                                                        mt={10}
                                                        height='30px'
                                                        width='120px'
                                                        fontSize='16px'
                                                        fontWeight='400'
                                                        isLoading={isLoading}
                                                        loadingText='Verifying'
                                                        onClick={verifyOtp}
                                                        isDisabled={otpVal.length !== 6}
                                                    >
                                                        Verify OTP
                                                    </Button>   
                                                </VStack>
                                    </motion.div>
                                </AnimatePresence>
                            )
                        }
                        
                </VStack>        
            </ChakraProvider>
        </>
    )


}