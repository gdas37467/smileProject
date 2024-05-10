import React, { useState } from 'react'
import { Button, ChakraProvider, Checkbox, FormControl, FormHelperText, FormLabel, Grid, GridItem, Heading, Icon, IconButton, Input, InputGroup, InputLeftAddon, Radio, RadioGroup, Select, Stack, Textarea, VStack } from '@chakra-ui/react';
import { Backdrop, Box, Fade, Modal } from '@mui/material'
import { IdentificationBadge, Envelope, Phone ,Calendar, Password, Eye, EyeSlash, HouseLine, Drop, Gauge, CalendarCheck      } from '@phosphor-icons/react'
import axios from 'axios';


//Style for Modal
const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {lg : '75rem' , xs : '40rem'},
    minHeight : '35rem',
    maxHeight : '65rem',
    backgroundColor: 'rgb(214, 205, 205)',
    borderRadius: '2rem',
    borderLeft: '2px solid rgb(214,205,205)',
    borderBottom: '2px solid rgb(214,205,205)',
    boxShadow: 24,
    p: 4,
    '@media only screen and (max-width : 767px)' : {
        width: '36rem',
        height : '50rem',
        overflowY : 'scrollY',
    }
    // zIndex : 3,
};


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;


const Registration = () => {
    axios.defaults.withCredentials=true;

    const isRecipient = true //props.isRecipient
    const emailProp = 'shauvik.paul@lims.com';
    // State variables
    const [open, setOpen] = useState(true)
    // Check for Invalid Registration
    const [isDonorValid , setIsDonorValid] = useState({
        fullName : false,
        email : false,
        phoneNumber : false,
        address : false,
    })

    //Donor Information
    const [donorInfo, setDonorInfo] = useState({
        fullName : '',
        dob : '',
        email : '',
        phoneNumber : '',
        address : '',
        bloodGroup : '',
        gender: '',
        lastDonated : '',
        isThalassemia : false,
    })
    // Check for Invalid Registration
    const [isRecipientValid , setIsRecipientValid] = useState({
        fullName : false,
        email : false,
        phoneNumber : false,
        address : false,
    })

    //Donor Information
    const [recipientInfo, setRecipientInfo] = useState({
        fullName : '',
        dob : '',
        email : '',
        phoneNumber : '',
        address : '',
        gender: '',
    })
    

    // Handlers
    const handleClose = () => {
        console.log("Closed")
        // setOpen(false)
    }


     // Handle State Change of Donor Details
    const setDetails = (e) =>{
        let name = e.target.name
        let value = e.target.value
        switch(name){
            case 'fullName' : 
                if (value.trim().length < 3){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break

            case 'email' : 
                if(!emailRegex.test(value.trim())){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'phoneNumber' : 
                if(value.trim().length !== 10){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
                
            case 'address' : 
                if(value.trim().length < 10){
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : true
                    }))
                }else{
                    setIsDonorValid(prevState => ({
                        ...prevState,
                        [name] : false
                    }))
                }
                break
        }
        setDonorInfo(prevState => ({
                ...prevState , 
                [name] : e.target.value
            })
        )
    }



    
    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={open}
                onClose={handleClose}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <ChakraProvider>
                            {
                                !isRecipient ? (
                                    <>
                                        <VStack>
                                            <Heading> Recipient Registration </Heading>
                                        </VStack>
                                        <Grid mt={10} templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={10}>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='email'>Email</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Envelope} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='gray.300' readOnly height={30} fontSize={14} type="email" name="email" />
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='phoneNumber'>Phone</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Phone} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.phoneNumber ? 'red.400' : 'green.300'} isInvalid={isDonorValid.phoneNumber} height={30} fontSize={14} type="number" name="phoneNumber" value={donorInfo.phoneNumber} onChange={e => setDetails(e)} />
                                                    </InputGroup>
                                                    {isDonorValid.phoneNumber ? <FormHelperText color="red" fontWeight={500}>Please Enter a Valid Phone Number  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='fullName'>Full Name</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={IdentificationBadge} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.fullName ? 'red.400' : 'green.300'} isInvalid={isDonorValid.fullName} height={30} fontSize={14} type="text" name="fullName" value={donorInfo.fullName} onChange={e => setDetails(e)} colorScheme='pink' />
                                                    </InputGroup>
                                                    {isDonorValid.fullName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                </FormControl>
                                            </GridItem>
                                            
                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='dob'>Date of Birth</FormLabel>
                                                    <InputGroup>
                                                        <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                            <Icon as={Calendar} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                        </InputLeftAddon>
                                                        <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} type="date" name="dob" value={donorInfo.dob} onChange={e => setDetails(e)} />
                                                    </InputGroup>
                                                </FormControl>
                                            </GridItem>


                                            <GridItem>
                                                <FormControl isRequired>
                                                    <FormLabel htmlFor='gender'> Gender </FormLabel>
                                                    <RadioGroup onChange={e => setDonorInfo(prev => ({ ...prev, gender: e }))} name="gender" value={donorInfo.gender}>
                                                        <Stack direction='row' pt={4}>
                                                            <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                                            <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                                            <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                                        </Stack>
                                                    </RadioGroup>
                                                </FormControl>
                                            </GridItem>
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <VStack>

                                            <Heading> Donor Registration </Heading>
                                        </VStack>
                                        <Grid mt={10} templateColumns={{ lg: 'repeat(2, 1fr)' }} gap={10}>
                                                
                                        <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='email'>Email</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={Envelope} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                            </InputLeftAddon>
                                                            <Input variant='outline' backgroundColor='gray.300' value={emailProp} readOnly height={30} fontSize={14} type="email" name="email" />
                                                        </InputGroup>
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='phoneNumber'>Phone</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={Phone} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                            </InputLeftAddon>
                                                            <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.phoneNumber ? 'red.400' : 'green.300'} isInvalid={isDonorValid.phoneNumber} height={30} fontSize={14} type="number" name="phoneNumber" value={donorInfo.phoneNumber} onChange={e => setDetails(e)} />
                                                        </InputGroup>
                                                        {isDonorValid.phoneNumber ? <FormHelperText color="red" fontWeight={500}>Please Enter a Valid Phone Number  </FormHelperText> : null}
                                                    </FormControl>
                                                </GridItem>
                                                
                                                <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='fullName'>Full Name</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={IdentificationBadge} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                            </InputLeftAddon>
                                                            <Input variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.fullName ? 'red.400' : 'green.300'} isInvalid={isDonorValid.fullName} height={30} fontSize={14} type="text" name="fullName" value={donorInfo.fullName} onChange={e => setDetails(e)} colorScheme='pink' />
                                                        </InputGroup>
                                                        {isDonorValid.fullName ? <FormHelperText color="red" fontWeight={500}> Name is too Short, Minimum 3 Characters is required  </FormHelperText> : null}
                                                    </FormControl>
                                                </GridItem>
                                                
                                                <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='dob'>Date of Birth</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={Calendar} boxSize={8} weight="duotone" color="#f0e3e4" />
                                                            </InputLeftAddon>
                                                            <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} type="date" name="dob" value={donorInfo.dob} onChange={e => setDetails(e)} />
                                                        </InputGroup>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='bloodGroup'>Blood Group</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={Drop} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                            </InputLeftAddon>
                                                            <Select placeholder='Select Your Blood Group' height={30} fontSize={14} variant="outline" backgroundColor='red.50' name='bloodGroup' value={donorInfo.bloodGroup} onChange={e => setDetails(e)}>
                                                                <option value='A+'>A Positive (A+)</option>
                                                                <option value='A-'>A Negative (A-)</option>
                                                                <option value='B+'>B Positive (B+)</option>
                                                                <option value='B-'>B Negative (B-)</option>
                                                                <option value='O+'>O Positive (O+)</option>
                                                                <option value='O-'>O Negative (O-)</option>
                                                                <option value='AB+'>AB Positive (B+)</option>
                                                                <option value='AB-'>AB Negative (AB-)</option>
                                                            </Select>
                                                        </InputGroup>

                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <FormControl>
                                                        <FormLabel htmlFor='lastDonated'>Last Donated (Optional) </FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' height={30}>
                                                                <Icon as={CalendarCheck} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                            </InputLeftAddon>
                                                            <Input variant='outline' backgroundColor='red.50' height={30} fontSize={14} type="date" name="lastDonated" value={donorInfo.lastDonated} onChange={e => setDetails(e)} />
                                                        </InputGroup>
                                                    </FormControl>
                                                </GridItem>

                                                
                                                <GridItem>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='gender'> Gender </FormLabel>
                                                        <RadioGroup onChange={e => setDonorInfo(prev => ({ ...prev, gender: e }))} name="gender" value={donorInfo.gender}>
                                                            <Stack direction='row' pt={4}>
                                                                <Radio size='lg' colorScheme='red' value='male'>Male</Radio>
                                                                <Radio size='lg' colorScheme='red' value='female'>Female</Radio>
                                                                <Radio size='lg' colorScheme='red' value='others'>Others</Radio>
                                                            </Stack>
                                                        </RadioGroup>
                                                    </FormControl>
                                                </GridItem>
                                                <GridItem>
                                                    <FormControl paddingTop={10}>
                                                        <InputGroup>
                                                            <FormLabel htmlFor='isThalassemia' sx={{fontSize : 15}}>Do you have Thalassemia?</FormLabel>
                                                            <Checkbox size='lg' colorScheme='orange' border="red" paddingLeft={5} name='isThalassemia' isChecked={donorInfo.isThalassemia} onChange={e => setDonorInfo(prevState => ({ ...prevState, isThalassemia: !prevState.isThalassemia }))} />
                                                        </InputGroup>
                                                    </FormControl>
                                                </GridItem>

                                                <GridItem colSpan={{ base: 1, lg: 2 }}>
                                                    <FormControl isRequired>
                                                        <FormLabel htmlFor='address'>Address</FormLabel>
                                                        <InputGroup>
                                                            <InputLeftAddon backgroundColor='#d71414' className='address' height={20}>
                                                                <Icon as={HouseLine} boxSize={8} weight='duotone' color='#f0e3e4' />
                                                            </InputLeftAddon>
                                                            <Textarea variant='outline' backgroundColor='red.50' errorBorderColor='red.400' focusBorderColor={isDonorValid.address ? 'red.400' : 'green.300'} isInvalid={isDonorValid.address} fontSize={14} resize='none' name="address" value={donorInfo.address} onChange={e => setDetails(e)} />
                                                        </InputGroup>
                                                        {isDonorValid.address ? <FormHelperText color="red" fontWeight={500}> Address is too Short, Minimum 10 Characters is required  </FormHelperText> : null}
                                                    </FormControl>
                                                </GridItem>

                                        </Grid>
                                    </>
                                )

                            }
                            <VStack>
                                <Button 
                                    color="black" bg="#d7141450" 
                                    _hover={{color:'#f0e3e4' , bg: '#d71414'}} 
                                    className='reg_btn'
                                    mt={10}
                                    height='30px'
                                    width='120px'
                                    fontSize='16px'
                                    fontWeight='400'
                                > Register </Button>
                            </VStack>
                        </ChakraProvider>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default Registration